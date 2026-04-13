import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="p-2 flex  mt-5 hover:bg-[#6dbb7142] text-[#6dbb71] rounded-full"
    >
      <ChevronLeft /> Go Back
    </button>
  );
}

export default BackButton;