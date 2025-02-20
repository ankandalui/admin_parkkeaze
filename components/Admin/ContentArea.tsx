import { Overview } from "./content/Overview";
import { Users } from "./content/Users";
import ParkingSpaces from "./content/ParkingSpaces";
import { Payments } from "./content/Payments";
import Unauthorize from "./content/Unauthorize";

interface ContentAreaProps {
  activeTab: string;
}

export function ContentArea({ activeTab }: ContentAreaProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <Users />;
      case "parking":
        return <ParkingSpaces />;
      case "payments":
        return <Payments />;
      case "unauthorize":
        return <Unauthorize />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="ml-64 p-4">
      <h2 className="text-2xl font-bold mb-4">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </h2>
      {renderContent()}
    </div>
  );
}
