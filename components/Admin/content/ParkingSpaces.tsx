import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ParkingSpotType,
  FloorType,
  SlotType,
  ParkingFormData,
  LatLng,
} from "@/types";
import { MoreVertical, Edit, Trash2, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const libraries: ["places"] = ["places"];

if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  throw new Error("Google Maps API key is required");
}

export default function ParkingSpaces() {
  const { toast } = useToast();
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [spots, setSpots] = useState<ParkingSpotType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingSpot, setEditingSpot] = useState<ParkingSpotType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState<ParkingFormData>({
    locationName: "",
    parkingName: "",
    type: "public",
    totalSpots: "",
    price: "",
    address: "",
    openTime: "09:00",
    closeTime: "18:00",
    features: "",
    description: "",
    floors: [
      {
        floorNumber: "G",
        floorName: "Ground Floor",
        slots: [],
      },
    ],
  });

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "parking_spots"));
      const spotsData: ParkingSpotType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ParkingSpotType, "id">),
      }));
      setSpots(spotsData);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch parking spots",
      });
    }
  };

  const validateParkingName = async (
    locationName: string,
    parkingName: string,
    id?: string
  ) => {
    const q = query(
      collection(db, "parking_spots"),
      where("locationName", "==", locationName),
      where("parkingName", "==", parkingName)
    );
    const querySnapshot = await getDocs(q);

    if (id) {
      return querySnapshot.docs.every((doc) => doc.id === id);
    }

    return querySnapshot.empty;
  };

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setSelectedLocation(location);
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(17);
          }

          setFormData((prev) => ({
            ...prev,
            locationName: place.name || "",
            address: place.formatted_address || "",
          }));
        }
      }
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(newLocation);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: newLocation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        const locationName =
          results[0].address_components[1]?.long_name || "Unknown Location";
        setFormData((prev) => ({
          ...prev,
          address,
          locationName,
        }));
      }
    });
  };

  const handleAddFloor = () => {
    setFormData((prev) => ({
      ...prev,
      floors: [
        ...prev.floors,
        {
          floorNumber: String(prev.floors.length),
          floorName: `Floor ${prev.floors.length}`,
          slots: [],
        },
      ],
    }));
  };

  const handleRemoveFloor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev.floors.filter((_, i) => i !== index),
    }));
  };

  const generateSlots = (floorIndex: number) => {
    const sections = ["A", "B", "C", "D"];
    const slotsPerSection = 10;
    const slots: SlotType[] = [];

    sections.forEach((section) => {
      for (let i = 1; i <= slotsPerSection; i++) {
        const slotNumber = `${section}${i.toString().padStart(2, "0")}`;
        slots.push({
          id: `${floorIndex}-${slotNumber}`,
          slotNumber,
        });
      }
    });

    setFormData((prev) => {
      const newFloors = [...prev.floors];
      newFloors[floorIndex] = {
        ...newFloors[floorIndex],
        slots,
      };
      return { ...prev, floors: newFloors };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a location on the map",
      });
      return;
    }

    const isNameValid = await validateParkingName(
      formData.locationName,
      formData.parkingName
    );
    if (!isNameValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "A parking spot with this name already exists at this location",
      });
      return;
    }

    setLoading(true);

    try {
      const parkingData = {
        locationName: formData.locationName,
        parkingName: formData.parkingName,
        type: formData.type,
        price:
          formData.type === "private"
            ? parseFloat(formData.price) || 0
            : formData.price
            ? parseFloat(formData.price)
            : null,
        totalSpots: parseInt(formData.totalSpots),
        address: formData.address,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        operatingHours: {
          open: formData.openTime,
          close: formData.closeTime,
        },
        floors: formData.floors,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        description: formData.description,
      };

      await addDoc(collection(db, "parking_spots"), parkingData);
      resetForm();
      toast({
        title: "Success",
        description: "Parking spot added successfully",
      });
      fetchParkingSpots();
    } catch (error) {
      console.error("Error adding parking spot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add parking spot",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spotId: string) => {
    try {
      await deleteDoc(doc(db, "parking_spots", spotId));
      toast({
        title: "Success",
        description: "Parking spot deleted successfully",
      });
      fetchParkingSpots();
    } catch (error) {
      console.error("Error deleting parking spot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete parking spot",
      });
    }
  };

  const handleEdit = async (spot: ParkingSpotType) => {
    setEditingSpot(spot);
    setFormData({
      locationName: spot.locationName,
      parkingName: spot.parkingName,
      type: spot.type,
      totalSpots: spot.totalSpots.toString(),
      price: spot.price?.toString() || "",
      address: spot.address,
      openTime: spot.operatingHours.open,
      closeTime: spot.operatingHours.close,
      features: spot.features?.join(", ") || "",
      description: spot.description || "",
      floors: spot.floors || [],
    });
    setSelectedLocation({ lat: spot.latitude, lng: spot.longitude });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSpot || !selectedLocation) return;

    const isNameValid = await validateParkingName(
      formData.locationName,
      formData.parkingName,
      editingSpot.id
    );
    if (!isNameValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "A parking spot with this name already exists at this location",
      });
      return;
    }

    setLoading(true);
    try {
      const parkingData = {
        locationName: formData.locationName,
        parkingName: formData.parkingName,
        type: formData.type,
        price:
          formData.type === "private"
            ? parseFloat(formData.price) || 0
            : formData.price
            ? parseFloat(formData.price)
            : null,
        totalSpots: parseInt(formData.totalSpots),
        address: formData.address,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        operatingHours: {
          open: formData.openTime,
          close: formData.closeTime,
        },
        floors: formData.floors,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        description: formData.description,
      };

      await updateDoc(doc(db, "parking_spots", editingSpot.id), parkingData);
      setIsEditDialogOpen(false);
      setEditingSpot(null);
      resetForm();
      fetchParkingSpots();

      toast({
        title: "Success",
        description: "Parking spot updated successfully",
      });
    } catch (error) {
      console.error("Error updating parking spot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update parking spot",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      locationName: "",
      parkingName: "",
      type: "public",
      totalSpots: "",
      price: "",
      address: "",
      openTime: "09:00",
      closeTime: "18:00",
      features: "",
      description: "",
      floors: [
        {
          floorNumber: "G",
          floorName: "Ground Floor",
          slots: [],
        },
      ],
    });
    setSelectedLocation(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Parking Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Location Map (Search & Click to Select)</Label>
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                libraries={libraries}
              >
                <div className="mb-4">
                  <StandaloneSearchBox
                    onLoad={(ref) => {
                      searchBoxRef.current = ref;
                    }}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Input
                      type="text"
                      placeholder="Search for a location"
                      className="w-full"
                    />
                  </StandaloneSearchBox>
                </div>

                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={selectedLocation || center}
                  zoom={13}
                  onClick={handleMapClick}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {selectedLocation && <Marker position={selectedLocation} />}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationName: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter location name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingName">Parking Name</Label>
                <Input
                  id="parkingName"
                  value={formData.parkingName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parkingName: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter parking name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as "public" | "private",
                    }))
                  }
                  required
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpots">Total Spots</Label>
                <Input
                  id="totalSpots"
                  type="number"
                  value={formData.totalSpots}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalSpots: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  placeholder="Number of parking spots"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price per Hour{" "}
                  {formData.type === "private" ? "(Required)" : "(Optional)"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required={formData.type === "private"}
                  min="0"
                  placeholder="Enter price per hour (0 for free parking)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      openTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      closeTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                  placeholder="Parking location address"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Floor Configuration</Label>
                {formData.floors.map((floor, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Floor {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFloor(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`floorNumber-${index}`}>
                          Floor Number
                        </Label>
                        <Input
                          id={`floorNumber-${index}`}
                          value={floor.floorNumber}
                          onChange={(e) => {
                            const newFloors = [...formData.floors];
                            newFloors[index].floorNumber = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              floors: newFloors,
                            }));
                          }}
                          placeholder="G, 1, 2, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`floorName-${index}`}>Floor Name</Label>
                        <Input
                          id={`floorName-${index}`}
                          value={floor.floorName}
                          onChange={(e) => {
                            const newFloors = [...formData.floors];
                            newFloors[index].floorName = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              floors: newFloors,
                            }));
                          }}
                          placeholder="Ground Floor, First Floor, etc."
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => generateSlots(index)}
                    >
                      Generate Slots
                    </Button>
                    {floor.slots.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {floor.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-2 text-center border rounded-md text-sm"
                          >
                            {slot.slotNumber}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFloor}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Floor
                </Button>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                  placeholder="CCTV, Security Guard, Covered Parking, etc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Enter parking spot description"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Parking Spot"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 mb-4 border-b">
            <DialogTitle>Edit Parking Spot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-locationName">Location Name</Label>
                <Input
                  id="edit-locationName"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationName: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter location name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parkingName">Parking Name</Label>
                <Input
                  id="edit-parkingName"
                  value={formData.parkingName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parkingName: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter parking name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as "public" | "private",
                    }))
                  }
                  required
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-totalSpots">Total Spots</Label>
                <Input
                  id="edit-totalSpots"
                  type="number"
                  value={formData.totalSpots}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalSpots: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  placeholder="Number of parking spots"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">
                  Price per Hour{" "}
                  {formData.type === "private" ? "(Required)" : "(Optional)"}
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required={formData.type === "private"}
                  min="0"
                  placeholder="Enter price per hour (0 for free parking)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-openTime">Opening Time</Label>
                <Input
                  id="edit-openTime"
                  type="time"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      openTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-closeTime">Closing Time</Label>
                <Input
                  id="edit-closeTime"
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      closeTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                  placeholder="Parking location address"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Floor Configuration</Label>
                {formData.floors.map((floor, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Floor {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFloor(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-floorNumber-${index}`}>
                          Floor Number
                        </Label>
                        <Input
                          id={`edit-floorNumber-${index}`}
                          value={floor.floorNumber}
                          onChange={(e) => {
                            const newFloors = [...formData.floors];
                            newFloors[index].floorNumber = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              floors: newFloors,
                            }));
                          }}
                          placeholder="G, 1, 2, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-floorName-${index}`}>
                          Floor Name
                        </Label>
                        <Input
                          id={`edit-floorName-${index}`}
                          value={floor.floorName}
                          onChange={(e) => {
                            const newFloors = [...formData.floors];
                            newFloors[index].floorName = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              floors: newFloors,
                            }));
                          }}
                          placeholder="Ground Floor, First Floor, etc."
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => generateSlots(index)}
                    >
                      Generate Slots
                    </Button>
                    {floor.slots.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {floor.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-2 text-center border rounded-md text-sm"
                          >
                            {slot.slotNumber}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFloor}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Floor
                </Button>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-features">
                  Features (comma-separated)
                </Label>
                <Input
                  id="edit-features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      features: e.target.value,
                    }))
                  }
                  placeholder="CCTV, Security Guard, Covered Parking, etc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <textarea
                  id="edit-description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Enter parking spot description"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Parking Spot"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Existing Parking Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spots.map((spot) => (
              <Card key={spot.id} className="p-4 relative">
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(spot)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(spot.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold">{spot.locationName}</h3>
                <p className="text-sm text-muted-foreground">
                  {spot.parkingName}
                </p>
                <p className="text-sm text-gray-500">{spot.address}</p>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      spot.type === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {spot.type}
                  </span>
                  <span className="ml-2 text-sm">
                    {spot.totalSpots} total spots
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  {spot.price !== null && spot.price !== undefined ? (
                    <div className="text-primary">
                      {spot.price === 0 ? "Free Parking" : `${spot.price}/hour`}
                    </div>
                  ) : null}
                  <div className="text-gray-600">
                    {spot.operatingHours.open} - {spot.operatingHours.close}
                  </div>
                </div>
                {spot.features && spot.features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {spot.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
