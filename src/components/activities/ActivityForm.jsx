// src/components/activities/ActivityForm.jsx
import React from "react";
import ReactQuill from "react-quill";
import TextField from "../ui/shared/TextField";
import SelectField from "../ui/shared/SelectField";
import Button from "../ui/shared/Button";

const learningAreaOptions = [
  { value: "", label: "Select relevant learning areas (e.g., Math, Science, Fine Motor)" },
  { value: "emotional_health", label: "Emotional Health" },
  { value: "self_care", label: "Self-care" },
  { value: "financial_literacy", label: "Financial Literacy" },
  { value: "gratitude", label: "Gratitude" },
];

const ageGroupOptions = [
  { value: "", label: "Select relevant age group" },
  { value: "3-5", label: "3–5 years" },
  { value: "4-6", label: "4–6 years" },
  { value: "3-6", label: "3–6 years" },
];

const durationOptions = [
  { value: "", label: "e.g., 5 min, 10 min, 15 min, 20+ min." },
  { value: "5", label: "5 minutes" },
  { value: "10", label: "10 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "20+", label: "20+ minutes" },
];

const defaultValues = {
  name: "",
  description: "",
  learningArea: "",
  ageGroup: "",
  duration: "",
  materials: "",
  effectOnChild: "",
  coverImage: "",
  gallery: [],
  resources: [],
};

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "bullet" }, { list: "ordered" }],
    ["link"],
  ],
};

const quillFormats = ["bold", "italic", "underline", "list", "bullet", "link"];

// Small wrapper so both rich text fields look like in the Figma
const RichTextEditorField = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1 text-xs">
    <label className="block text-[11px] font-medium text-slate-700">
      {label}
    </label>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={quillModules}
        formats={quillFormats}
        className="activity-editor text-xs"
      />
    </div>
  </div>
);

const ActivityForm = ({ mode = "create", initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = React.useState({ ...defaultValues, ...initialValues });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const coverInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);
  const resourcesInputRef = React.useRef(null);

  React.useEffect(() => {
    // When initialValues change (e.g., when editing), merge with defaultValues
    // This ensures all fields have values, even if some are missing from initialValues
    if (initialValues && Object.keys(initialValues).length > 0) {
      const mergedValues = { ...defaultValues, ...initialValues };
      setValues(mergedValues);
    } else {
      setValues(defaultValues);
    }
  }, [initialValues]); // React to initialValues changes

  const handleChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleQuillChange = (field) => (html) =>
    setValues((prev) => ({ ...prev, [field]: html }));

  const handleFileInput = (field) => (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setValues((prev) => {
      if (field === "coverImage") {
        return { ...prev, coverImage: files[0] };
      }
      if (field === "gallery") {
        return { ...prev, gallery: [...(prev.gallery || []), ...files] };
      }
      if (field === "resources") {
        return { ...prev, resources: [...(prev.resources || []), ...files] };
      }
      return prev;
    });

    e.target.value = null;
  };

  const removeGalleryItem = (index) => {
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const removeResourceItem = (index) => {
    setValues((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const removeCoverImage = () => {
    setValues((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  // helper to get filename for File or string
  const getFileName = (file, fallback) =>
    typeof file === "string" ? fallback || "File" : file.name || fallback || "File";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-xs"
    >
      {/* Title */}
      <TextField
        label="Title"
        placeholder="e.g., Jungle Safari"
        value={values.name}
        onChange={handleChange("name")}
      />

      {/* Description (rich text) */}
      <RichTextEditorField
        label="Description"
        value={values.description}
        onChange={handleQuillChange("description")}
        placeholder="What’s the brain benefit? See how this activity supports real brain growth—building the skills that shape their future."
      />

      {/* Learning area / age / duration / materials */}
      <SelectField
        label="Learning Areas"
        value={values.learningArea}
        onChange={handleChange("learningArea")}
        options={learningAreaOptions}
      />

      <SelectField
        label="Age Group"
        value={values.ageGroup}
        onChange={handleChange("ageGroup")}
        options={ageGroupOptions}
      />

      <SelectField
        label="Estimated Duration"
        value={values.duration}
        onChange={handleChange("duration")}
        options={durationOptions}
      />

      <TextField
        label="Materials Needed"
        placeholder="Select or add relevant materials needed"
        value={values.materials}
        onChange={handleChange("materials")}
      />

      {/* Effect on child (rich text) */}
      <RichTextEditorField
        label="Effect on Child"
        value={values.effectOnChild}
        onChange={handleQuillChange("effectOnChild")}
        placeholder="What’s the brain benefit? See how this activity supports real brain growth—building the skills that shape their future."
      />

      {/* Cover image */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-slate-700">
            Activity Cover Image (png/jpeg/svg/webp) *
          </label>
        </div>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput("coverImage")}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          {values.coverImage && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                {typeof values.coverImage === "string" ? (
                  <img
                    src={values.coverImage}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(values.coverImage)}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-800">
                  {getFileName(values.coverImage, "cover.png")}
                </div>
                <div className="text-[10px] text-slate-400">Cover image</div>
              </div>
              <button
                type="button"
                onClick={removeCoverImage}
                className="ml-2 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-100"
              >
                Remove
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-base font-bold text-slate-500 hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-2 text-xs">
        <label className="text-[11px] font-medium text-slate-700">
          Gallery Images &amp; Videos
        </label>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileInput("gallery")}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-2">
          {values.gallery?.map((file, i) => {
            const src =
              typeof file === "string" ? file : URL.createObjectURL(file);
            const isImage = typeof file === "string" || file.type?.startsWith("image");
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 text-[11px] shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {isImage ? (
                    <img src={src} alt={getFileName(file)} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-500">Video</span>
                  )}
                </div>
                <div className="max-w-[90px] truncate">
                  <div className="font-medium text-slate-800">
                    {getFileName(file)}
                  </div>
                  <div className="text-[10px] text-slate-400">Gallery</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(i)}
                  className="ml-1 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-100"
                >
                  Remove
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-base font-bold text-slate-500 hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-2 text-xs">
        <label className="text-[11px] font-medium text-slate-700">
          Activity Resources *
        </label>

        <input
          ref={resourcesInputRef}
          type="file"
          multiple
          onChange={handleFileInput("resources")}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-2">
          {values.resources?.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 text-[11px] shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600">
                PDF
              </div>
              <div className="max-w-[110px] truncate">
                <div className="font-medium text-slate-800">
                  {getFileName(file, "Resource")}
                </div>
                <div className="text-[10px] text-slate-400">Resource</div>
              </div>
              <button
                type="button"
                onClick={() => removeResourceItem(i)}
                className="ml-1 rounded-full bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-100"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => resourcesInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-base font-bold text-slate-500 hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
        {mode === "edit" ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:w-1/2"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 py-2 text-[11px] font-semibold text-white hover:bg-black sm:w-1/2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "SAVE CHANGES"}
            </Button>
          </div>
        ) : (
          <>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 py-2 text-[11px] font-semibold text-white hover:bg-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "ADD ACTIVITY"}
            </Button>
            <button
              type="button"
              className="text-center text-[11px] font-medium text-slate-500 hover:text-slate-700"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default ActivityForm;
