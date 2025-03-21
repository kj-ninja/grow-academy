import React, { KeyboardEventHandler, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text/Text";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
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
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
      />

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
