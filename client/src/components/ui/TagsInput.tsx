import React, { KeyboardEventHandler, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Text from "@/components/ui/Text/Text";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  className,
  placeholder = "Enter tags",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const newTag = inputValue.trim();

    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag: string) => tag !== tagToRemove));
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  return (
    <>
      <Input
        className={cn(className)}
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
      />

      {value.length > 0 && (
        <div className="px-2.5">
          <div className="w-full h-[1px] bg-tints-gigaverseDarkBlue-10" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag) => (
          <Text
            type="bodyXXSmallBold"
            key={tag}
            className="flex items-center justify-center border rounded-sm px-2.5 py-1 border-gray-500 bg-background"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-error hover:text-error/80"
            >
              <X size={10} />
            </button>
          </Text>
        ))}
      </div>
    </>
  );
};
