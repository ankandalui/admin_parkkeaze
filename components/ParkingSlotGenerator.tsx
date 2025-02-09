import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { FloorType } from "@/types"; // Make sure to import your types

interface ParkingSlotGeneratorProps {
  totalSpots: string;
  floors: FloorType[];
  onTotalSpotsChange: (value: string) => void;
  onFloorsChange: (floors: FloorType[]) => void;
}

const ParkingSlotGenerator: React.FC<ParkingSlotGeneratorProps> = ({
  totalSpots,
  floors,
  onTotalSpotsChange,
  onFloorsChange,
}) => {
  const generateSlots = (floorIndex: number, totalSpots: number) => {
    const slots = [];
    const spotsPerSection = Math.ceil(totalSpots / 4);
    const sections = ["A", "B", "C", "D"];

    let slotCount = 0;
    let sectionIndex = 0;

    while (slotCount < totalSpots && sectionIndex < sections.length) {
      const section = sections[sectionIndex];
      const sectionSpots = Math.min(spotsPerSection, totalSpots - slotCount);

      for (let i = 1; i <= sectionSpots; i++) {
        const slotNumber = `${section}${i.toString().padStart(2, "0")}`;
        slots.push({
          id: `${floorIndex}-${slotNumber}`,
          slotNumber,
        });
        slotCount++;
      }
      sectionIndex++;
    }

    const newFloors = [...floors];
    newFloors[floorIndex] = {
      ...newFloors[floorIndex],
      slots,
    };
    onFloorsChange(newFloors);
  };

  const handleAddFloor = () => {
    onFloorsChange([
      ...floors,
      {
        floorNumber: String(floors.length),
        floorName: `Floor ${floors.length}`,
        slots: [],
      },
    ]);
  };

  const handleRemoveFloor = (index: number) => {
    if (index === 0) return;
    onFloorsChange(floors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="totalSpots">Total Slots</Label>
        <Input
          id="totalSpots"
          type="number"
          value={totalSpots}
          onChange={(e) => onTotalSpotsChange(e.target.value)}
          min="1"
          placeholder="Enter total number of slots"
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <Label>Floor Configuration</Label>
        {floors.map((floor, index) => (
          <div key={index} className="p-4 border rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">
                Floor {index === 0 ? "(Ground)" : index}
              </h4>
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`floorNumber-${index}`}>Floor Number</Label>
                <Input
                  id={`floorNumber-${index}`}
                  value={floor.floorNumber}
                  onChange={(e) => {
                    const newFloors = [...floors];
                    newFloors[index].floorNumber = e.target.value;
                    onFloorsChange(newFloors);
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
                    const newFloors = [...floors];
                    newFloors[index].floorName = e.target.value;
                    onFloorsChange(newFloors);
                  }}
                  placeholder="Ground Floor, First Floor, etc."
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateSlots(index, parseInt(totalSpots))}
              disabled={!totalSpots}
              className="mb-4"
            >
              Generate Slots
            </Button>

            {floor.slots.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {floor.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-2 text-center border rounded-md text-sm bg-gray-50"
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
    </div>
  );
};

export default ParkingSlotGenerator;
