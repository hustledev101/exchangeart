"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  uploadedAt: string;
  userId: string;
  sold?: boolean;
  uploadedToMarketplace?: boolean;
  originalPrice?: string;
  gasFee?: {
    amount: number;
    currency: string;
    usdValue: number;
  };
  conversionRate?: number;
}

interface Auction {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
  sold?: boolean;
}

const AdminUsersCollectionsPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  // State for modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    image: "",
    reserve: "",
    currency: "USD",
    category: "Collectibles",
    description: "",
  });

  // New state for selected image file and preview URL
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load all artworks from localStorage
    const loadAllArtworks = () => {
      const allArtworks = localStorage.getItem("allUserArtworks");
      if (allArtworks) {
        const artworksData = JSON.parse(allArtworks);
        setArtworks(artworksData);
      } else {
        setArtworks([]);
      }
      setLoading(false);
    };

    loadAllArtworks();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadAllArtworks();
    };

    // Listen for gallery updates
    const handleGalleryUpdate = () => {
      loadAllArtworks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("galleryUpdated", handleGalleryUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("galleryUpdated", handleGalleryUpdate);
    };
  }, []);

  const handleDelete = (id: number) => {
    const allArtworks = localStorage.getItem("allUserArtworks");
    if (allArtworks) {
      const artworksData = JSON.parse(allArtworks);
      const artworkToDelete = artworksData.find(
        (artwork: Artwork) => artwork.id === id
      );
      const updatedArtworks = artworksData.filter(
        (artwork: Artwork) => artwork.id !== id
      );
      localStorage.setItem("allUserArtworks", JSON.stringify(updatedArtworks));
      setArtworks(updatedArtworks);

      // If the artwork was uploaded to marketplace, remove it from marketplaceArtworks
      if (artworkToDelete && artworkToDelete.uploadedToMarketplace) {
        const marketplaceArtworks = localStorage.getItem("marketplaceArtworks");
        if (marketplaceArtworks) {
          const marketplaceItems: Auction[] = JSON.parse(marketplaceArtworks);
          const updatedMarketplace = marketplaceItems.filter(
            (item: Auction) => item.id !== id
          );
          localStorage.setItem(
            "marketplaceArtworks",
            JSON.stringify(updatedMarketplace)
          );
        }
      }

      toast.success("Artwork deleted successfully");
      // Dispatch event to notify other components
      window.dispatchEvent(new Event("galleryUpdated"));
    }
  };

  const handleMarkAsSold = (id: number) => {
    const allArtworks = localStorage.getItem("allUserArtworks");
    if (allArtworks) {
      const artworksData = JSON.parse(allArtworks);
      const artwork = artworksData.find((a: Artwork) => a.id === id);

      if (!artwork) {
        toast.error("Artwork not found");
        return;
      }

      // Parse price to extract amount and currency
      const priceMatch = artwork.price.match(/^(\d+(?:\.\d+)?)\s+([A-Z]+)$/);
      if (!priceMatch) {
        toast.error("Invalid price format");
        return;
      }

      const amount = parseFloat(priceMatch[1]);
      const currency = priceMatch[2];

      // Find the user's email from userId (which might be username or email)
      let userEmail = artwork.userId;
      if (artwork.userId !== "admin") {
        const userCredentials = JSON.parse(
          localStorage.getItem("user_credentials") || "[]"
        );
        const userRecord = userCredentials.find(
          (user: any) =>
            user.username === artwork.userId || user.email === artwork.userId
        );

        if (userRecord) {
          userEmail = userRecord.email;
        }
      }

      // Create sale transaction
      const saleTransaction = {
        id: `sale_${Date.now()}_${id}`,
        type: "Sale" as const,
        status: "Approved" as const,
        date: new Date().toISOString(),
        amount: amount,
        username: artwork.userId,
        userEmail: userEmail,
        coin: currency,
      };

      // Add transaction to localStorage
      const existingTransactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      existingTransactions.push(saleTransaction);
      localStorage.setItem(
        "transactions",
        JSON.stringify(existingTransactions)
      );

      // Update user balance using the correct email
      const balanceKey = `userBalances_${userEmail}`;
      const existingBalances = JSON.parse(
        localStorage.getItem(balanceKey) || "{}"
      );
      if (!existingBalances[currency]) {
        existingBalances[currency] = 0;
      }
      existingBalances[currency] += amount;
      localStorage.setItem(balanceKey, JSON.stringify(existingBalances));

      // Update artworks
      const updatedArtworks = artworksData.map((artwork: Artwork) =>
        artwork.id === id ? { ...artwork, sold: true } : artwork
      );
      localStorage.setItem("allUserArtworks", JSON.stringify(updatedArtworks));
      setArtworks(updatedArtworks);

      // If the artwork is uploaded to marketplace, update marketplaceArtworks as well
      if (artwork.uploadedToMarketplace) {
        const marketplaceArtworks = localStorage.getItem("marketplaceArtworks");
        if (marketplaceArtworks) {
          const marketplaceItems: Auction[] = JSON.parse(marketplaceArtworks);
          const updatedMarketplace = marketplaceItems.map((item: Auction) =>
            item.id === id ? { ...item, sold: true } : item
          );
          localStorage.setItem(
            "marketplaceArtworks",
            JSON.stringify(updatedMarketplace)
          );
        }
      }

      toast.success("Artwork marked as sold and sale transaction created");
      // Dispatch events to notify other components
      window.dispatchEvent(new Event("galleryUpdated"));
      window.dispatchEvent(
        new StorageEvent("storage", { key: "transactions" })
      );
      window.dispatchEvent(new StorageEvent("storage", { key: balanceKey }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.artist.trim()) errors.artist = "Artist is required";
    if (!selectedImageFile) errors.image = "Image is required";
    if (!formData.reserve.trim()) errors.reserve = "Reserve price is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Generate unique ID
    const newId = Date.now();

    // Create new auction object
    const newAuction: Auction = {
      id: newId,
      title: formData.title,
      artist: formData.artist,
      image: formData.image,
      reserve: formData.reserve,
      category: formData.category,
      description: formData.description,
    };

    // Add to marketplaceArtworks localStorage
    const marketplaceArtworks = localStorage.getItem("marketplaceArtworks");
    let marketplaceItems: Auction[] = [];
    if (marketplaceArtworks) {
      marketplaceItems = JSON.parse(marketplaceArtworks);
    }
    marketplaceItems.push(newAuction);
    localStorage.setItem(
      "marketplaceArtworks",
      JSON.stringify(marketplaceItems)
    );

    // Also add to allUserArtworks as admin artwork
    const allUserArtworks = localStorage.getItem("allUserArtworks");
    let allArtworks: Artwork[] = [];
    if (allUserArtworks) {
      allArtworks = JSON.parse(allUserArtworks);
    }
    const adminArtwork: Artwork = {
      id: newId,
      title: formData.title,
      description: formData.description,
      price: formData.reserve,
      category: formData.category,
      image: formData.image,
      uploadedAt: new Date().toISOString(),
      userId: "admin",
      sold: false,
      uploadedToMarketplace: true,
    };
    allArtworks.push(adminArtwork);
    localStorage.setItem("allUserArtworks", JSON.stringify(allArtworks));

    // Update local state
    setArtworks(allArtworks);

    // Reset form
    setFormData({
      title: "",
      artist: "",
      image: "",
      reserve: "",
      currency: "USD",
      category: "Collectibles",
      description: "",
    });
    setSelectedImageFile(null);
    setImagePreviewUrl("");
    setFormErrors({});

    // Close modal
    setIsModalOpen(false);

    // Show success toast
    toast.success("Artwork added successfully to marketplace!");

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("galleryUpdated"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading artworks...</div>
      </div>
    );
  }

  return (
    <div className="text-gray-50 space-y-6 m-5 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 border rounded-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All User Collections</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="bg-[#6172F3] ml-4 mr-4"
        >
          Add Artwork
        </Button>
        <div className="text-sm text-gray-100">
          Total Artworks: {artworks.length}
        </div>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-xl mb-4">No artworks uploaded yet</p>
          <p className="text-gray-500">
            Users haven&apos;t uploaded any artworks yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-[#2A2B35] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">
                  {artwork.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {artwork.description}
                </p>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-blue-400">
                    <span className="font-semibold">Artist:</span>{" "}
                    {artwork.userId}
                  </p>
                  <p className="text-sm text-green-400">
                    <span className="font-semibold">Price:</span>{" "}
                    {artwork.price}
                  </p>
                  {artwork.originalPrice && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Original:</span>{" "}
                      {artwork.originalPrice}
                    </p>
                  )}
                  <p className="text-sm text-purple-400">
                    <span className="font-semibold">Category:</span>{" "}
                    {artwork.category}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Uploaded: {new Date(artwork.uploadedAt).toLocaleDateString()}{" "}
                  at {new Date(artwork.uploadedAt).toLocaleTimeString()}
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleMarkAsSold(artwork.id)}
                    className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 transition-colors duration-200"
                    disabled={artwork.sold}
                  >
                    {artwork.sold ? "Sold" : "Mark as Sold"}
                  </button>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors duration-200"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Artwork Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80vh] text-[#F9FAFA] overflow-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Artwork</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                aria-invalid={!!formErrors.title}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => handleInputChange("artist", e.target.value)}
                aria-invalid={!!formErrors.artist}
              />
              {formErrors.artist && (
                <p className="text-red-500 text-sm mt-1">{formErrors.artist}</p>
              )}
            </div>
            <div>
              <Label htmlFor="image">Select Image</Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    setSelectedImageFile(file);
                    // Generate preview URL
                    const previewUrl = URL.createObjectURL(file);
                    setImagePreviewUrl(previewUrl);

                    // Convert file to base64 and update formData.image
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      handleInputChange("image", base64String);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setSelectedImageFile(null);
                    setImagePreviewUrl("");
                    handleInputChange("image", "");
                  }
                }}
                aria-invalid={!!formErrors.image}
                className="w-full border"
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
              {imagePreviewUrl && (
                <div className="mt-2">
                  <Image
                    src={imagePreviewUrl}
                    alt="Selected preview"
                    className="max-w-full max-h-48 rounded-md object-contain"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="reserve">Reserve Price</Label>
              <Input
                id="reserve"
                value={formData.reserve}
                onChange={(e) => handleInputChange("reserve", e.target.value)}
                aria-invalid={!!formErrors.reserve}
              />
              {formErrors.reserve && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.reserve}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="TRX">TRX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Collectibles">Collectibles</SelectItem>
                  <SelectItem value="Digital Art">Digital Art</SelectItem>
                  <SelectItem value="Drawing">Drawing</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                rows={4}
                aria-invalid={!!formErrors.description}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Artwork</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdminUsersCollectionsPage;
