import React from "react";
import TextField from "../ui/shared/TextField";
import SelectField from "../ui/shared/SelectField";
import Button from "../ui/shared/Button";
import { FiInfo } from "react-icons/fi";
import BadgePreviewCard from "./BadgePreviewCard";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const learningAreaOptions = [
  { value: "", label: "Select learning area / category" },
  { value: "general", label: "General" },
  { value: "gratitude", label: "Gratitude" },
  { value: "resilience", label: "Resilience" },
  { value: "self_care", label: "Self-care" },
  { value: "creative_thinking", label: "Creative Thinking" },
  { value: "financial_literacy", label: "Financial Literacy" },
  { value: "progress", label: "Progress" },
];

const badgeTypeOptions = [
  { value: "", label: "Select badge type" },
  { value: "milestone", label: "Milestone" },
  { value: "learning", label: "Learning" },
  { value: "streak", label: "Streak" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const defaultValues = {
  title: "",
  description: "",
  learningArea: "",
  badgeType: "",
  unlockCriteria: "",
  status: "inactive",
  iconFile: null,
  iconUrl: "",
};

const quillModules = {
  toolbar: [
    [{ header: [false, 2, 3] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "image",
];

const BadgeForm = ({
  mode = "create", // "create" | "edit"
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = React.useState({
    ...defaultValues,
    ...initialValues,
  });

  const [iconPreviewUrl, setIconPreviewUrl] = React.useState(
    initialValues?.iconUrl || ""
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
    });
    setIconPreviewUrl(initialValues?.iconUrl || "");
    setErrors({});
  }, [initialValues]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleDescriptionChange = (html) => {
    setValues((prev) => ({
      ...prev,
      description: html,
    }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setValues((prev) => ({ ...prev, iconFile: file }));
    setIconPreviewUrl(preview);
  };

  // Strip HTML tags from description for plain text validation
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.title || values.title.trim() === "") {
      newErrors.title = "Title is required";
    }

    const descriptionText = stripHtml(values.description || "");
    if (!descriptionText || descriptionText.trim() === "") {
      newErrors.description = "Description is required";
    }

    if (!values.learningArea || values.learningArea === "") {
      newErrors.learningArea = "Learning area / category is required";
    }

    if (!values.badgeType || values.badgeType === "") {
      newErrors.badgeType = "Badge type is required";
    }

    if (mode === "create" && !values.iconFile && !values.iconUrl) {
      newErrors.iconFile = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        ...values,
        iconUrl: values.iconUrl || iconPreviewUrl,
      });
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryLabel = mode === "create" ? "ADD BADGE" : "SAVE DETAILS";

  const learningAreaLabel =
    learningAreaOptions.find((o) => o.value === values.learningArea)?.label;
  const badgeTypeLabel =
    badgeTypeOptions.find((o) => o.value === values.badgeType)?.label;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* Preview card at top, like Figma */}
      <div className="mb-2">
        <BadgePreviewCard
          name={values.title}
          category={learningAreaLabel}
          type={badgeTypeLabel}
          status={values.status}
          iconUrl={iconPreviewUrl}
        />
      </div>

      {/* Title */}
      <TextField
        label="Title *"
        placeholder="e.g. Gratitude Builder"
        value={values.title}
        onChange={handleChange("title")}
        error={errors.title}
      />

      {/* Description with React Quill */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">
          Description *
        </label>
        <div className={`rounded-2xl border bg-white ${
          errors.description ? 'border-red-300' : 'border-slate-200'
        }`}>
          <ReactQuill
            theme="snow"
            value={values.description}
            onChange={handleDescriptionChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="e.g. Earned by completing 3 Gratitude activities."
            className="[&>.ql-toolbar]:rounded-t-2xl [&>.ql-toolbar]:border-0 [&>.ql-toolbar]:border-b [&>.ql-toolbar]:border-slate-200 [&>.ql-toolbar]:bg-slate-50 [&>.ql-container]:border-0 [&>.ql-container>.ql-editor]:min-h-[120px] [&>.ql-container>.ql-editor]:text-[11px] [&>.ql-container>.ql-editor]:text-slate-700"
          />
        </div>
        {errors.description && (
          <p className="text-[10px] text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Learning area / category */}
      <div>
        <SelectField
          label="Learning Area / Category *"
          value={values.learningArea}
          onChange={handleChange("learningArea")}
          options={learningAreaOptions}
          error={errors.learningArea}
        />
        {errors.learningArea && (
          <p className="text-[10px] text-red-500 mt-1">{errors.learningArea}</p>
        )}
      </div>

      {/* Badge type */}
      <div>
        <SelectField
          label="Badge Type *"
          value={values.badgeType}
          onChange={handleChange("badgeType")}
          options={badgeTypeOptions}
          error={errors.badgeType}
        />
        {errors.badgeType && (
          <p className="text-[10px] text-red-500 mt-1">{errors.badgeType}</p>
        )}
      </div>

      {/* Unlock criteria */}
      <TextField
        label="Unlock Criteria *"
        placeholder="Complete 3 activities under Gratitude."
        value={values.unlockCriteria}
        onChange={handleChange("unlockCriteria")}
      />

      {/* Upload icon */}
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
          Upload Icon (png/jpeg/svg/webp) {mode === "create" && "*"}
          <FiInfo className="text-[12px] text-slate-400" />
        </label>
        <div className={`rounded-xl border border-dashed bg-white px-3 py-3 ${
          errors.iconFile ? 'border-red-300' : 'border-slate-300'
        }`}>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.webp"
            onChange={handleIconChange}
            className="block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-lg file:border-none file:bg-emerald-500 file:px-3 file:py-1 file:text-[11px] file:font-semibold file:text-white"
          />
          {values.iconFile && (
            <div className="mt-2 text-[11px] text-slate-500">
              Selected: {values.iconFile.name}
            </div>
          )}
          {!values.iconFile && values.iconUrl && (
            <div className="mt-2 text-[11px] text-slate-500">
              Current icon: {values.iconUrl}
            </div>
          )}
        </div>
        {errors.iconFile && (
          <p className="text-[10px] text-red-500 mt-1">{errors.iconFile}</p>
        )}
      </div>

      {/* Status dropdown */}
      <SelectField
        label="Status *"
        value={values.status}
        onChange={handleChange("status")}
        options={statusOptions}
      />

      {/* Footer actions */}
      <div className="mt-4 space-y-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-400 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (mode === "create" ? "Adding..." : "Saving...") : primaryLabel}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BadgeForm;
