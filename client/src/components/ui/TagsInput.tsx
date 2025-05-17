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

      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((tag) => (
          <Text
            type="bodyXXSmallBold"
            key={tag}
            className="bg-background flex items-center justify-center rounded-sm border border-gray-500 px-2.5 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-error hover:text-error/80 ml-1"
            >
              <X size={10} />
            </button>
          </Text>
        ))}
      </div>
    </>
  );
};
