import React from "react";
import TextField from "../ui/shared/TextField";
import TextAreaField from "../ui/shared/TextAreaField";
import SelectField from "../ui/shared/SelectField";
import Button from "../ui/shared/Button";

const categoryOptions = [
  { value: "", label: "Select category" },
  { value: "gratitude", label: "Gratitude" },
  { value: "resilience", label: "Resilience" },
  { value: "creative", label: "Creative Thinking" },
  { value: "self_care", label: "Self-care" },
  { value: "financial", label: "Financial Literacy" },
];

const privacyOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const defaultValues = {
  name: "",
  description: "",
  category: "",
  privacy: "public",
};

const CommunityForm = ({
  initialValues,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = React.useState({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      // Map API data to form format
      const mappedValues = {
        name: initialValues.name || '',
        description: initialValues.description || '',
        category: initialValues.category || '',
        privacy: initialValues.isPublic === false ? 'private' : 'public',
      };
      setValues(mappedValues);
    } else {
      setValues({ ...defaultValues });
    }
  }, [initialValues, mode]);

  const handleChange = (field) => (e) =>
    setValues((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!values.name || values.name.trim() === '') {
      alert('Please enter a community name.');
      return;
    }
    
    if (!values.description || values.description.trim() === '') {
      alert('Please enter a description.');
      return;
    }
    
    if (!values.category || values.category === '') {
      alert('Please select a category.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.(values);
    } catch (err) {
      // Error handling is done in parent component
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Community Name"
        value={values.name}
        onChange={handleChange("name")}
        placeholder="e.g., Gratitude Garden"
      />

      <TextAreaField
        label="Description"
        value={values.description}
        onChange={handleChange("description")}
        rows={4}
        placeholder="Short description about this community"
      />

      <SelectField
        label="Category"
        value={values.category}
        onChange={handleChange("category")}
        options={categoryOptions}
      />

      <SelectField
        label="Privacy"
        value={values.privacy}
        onChange={handleChange("privacy")}
        options={privacyOptions}
      />

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-400 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? (mode === "create" ? "Adding..." : "Saving...") 
            : (mode === "create" ? "Add Community" : "Save Changes")
          }
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommunityForm;
