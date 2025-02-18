import { useState, useEffect } from "react";
import Select from "react-select";

interface LOVOption {
  value: string;
  label: string;
}

interface LOVProps {
  p_lovName: string;
  placeholder?: string;
  onChange: (selectedOption: { value: string; label: string } | null) => void;
  value?: string; // ✅ Ensure value is only a string
}

const LOV = ({ p_lovName, placeholder = "Select an option", onChange, value }: LOVProps) => {
  const [options, setOptions] = useState<LOVOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLOVData = async () => {
      setIsLoading(true);
      try {
        const v_resRt = await fetch(`/api/lov?lcat=${encodeURIComponent(p_lovName)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!v_resRt.ok) {
          throw new Error(`Failed to fetch LOV data: ${v_resRt.statusText}`);
        }

        const v_resRtData = await v_resRt.json();

        if (Array.isArray(v_resRtData.data)) {
          const v_lovOptions = v_resRtData.data.map((item: { rval: string; dval: string }) => ({
            value: item.rval,
            label: item.dval,
          }));
          setOptions(v_lovOptions);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("❌ Error fetching LOV data:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLOVData();
  }, [p_lovName]);

  return (
    <Select
      options={options}
      placeholder={placeholder}
      isLoading={isLoading}
      onChange={onChange} // ✅ Return selected option
      value={options.find((option) => option.value === value) || null} // ✅ Ensure value matches options
      isSearchable
      className="block mt-2 sm:text-sm text-black"
    />
  );
};

export default LOV;
