// import React from "react";
// import TextField from "../ui/shared/TextField";
// import TextAreaField from "../ui/shared/TextAreaField";
// import SelectField from "../ui/shared/SelectField";
// import Button from "../ui/shared/Button";

// const categoryOptions = [
//   { value: "", label: "Select category" },
//   { value: "gratitude", label: "Gratitude" },
//   { value: "resilience", label: "Resilience" },
//   { value: "creative", label: "Creative Thinking" },
//   { value: "self_care", label: "Self-care" },
//   { value: "financial", label: "Financial Literacy" },
// ];

// const privacyOptions = [
//   { value: "public", label: "Public" },
//   { value: "private", label: "Private" },
// ];

// const defaultValues = {
//   name: "",
//   description: "",
//   category: "",
//   privacy: "public",
// };

// const CommunityForm = ({
//   initialValues,
//   mode = "create",
//   onSubmit,
//   onCancel,
// }) => {
//   const [values, setValues] = React.useState({
//     ...defaultValues,
//     ...initialValues,
//   });
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   React.useEffect(() => {
//     if (initialValues && Object.keys(initialValues).length > 0) {
//       // Map API data to form format
//       const mappedValues = {
//         name: initialValues.name || '',
//         description: initialValues.description || '',
//         category: initialValues.category || '',
//         privacy: initialValues.isPublic === false ? 'private' : 'public',
//       };
//       setValues(mappedValues);
//     } else {
//       setValues({ ...defaultValues });
//     }
//   }, [initialValues, mode]);

//   const handleChange = (field) => (e) =>
//     setValues((p) => ({ ...p, [field]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!values.name || values.name.trim() === '') {
//       alert('Please enter a community name.');
//       return;
//     }
    
//     if (!values.description || values.description.trim() === '') {
//       alert('Please enter a description.');
//       return;
//     }
    
//     if (!values.category || values.category === '') {
//       alert('Please select a category.');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await onSubmit?.(values);
//     } catch (err) {
//       // Error handling is done in parent component
//       console.error('Error submitting form:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <TextField
//         label="Community Name"
//         value={values.name}
//         onChange={handleChange("name")}
//         placeholder="e.g., Gratitude Garden"
//       />

//       <TextAreaField
//         label="Description"
//         value={values.description}
//         onChange={handleChange("description")}
//         rows={4}
//         placeholder="Short description about this community"
//       />

//       <SelectField
//         label="Category"
//         value={values.category}
//         onChange={handleChange("category")}
//         options={categoryOptions}
//       />

//       <SelectField
//         label="Privacy"
//         value={values.privacy}
//         onChange={handleChange("privacy")}
//         options={privacyOptions}
//       />

//       <div className="pt-4">
//         <Button
//           type="submit"
//           variant="primary"
//           disabled={isSubmitting}
//           className="w-full rounded-xl bg-emerald-400 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting 
//             ? (mode === "create" ? "Adding..." : "Saving...") 
//             : (mode === "create" ? "Add Community" : "Save Changes")
//           }
//         </Button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="mt-2 w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-700"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CommunityForm;


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

  // ✅ new
  thumbnailMode: "upload", // "upload" | "url"
  thumbnailUrl: "",
  thumbnailFile: null,
};

const CommunityForm = ({ initialValues, mode = "create", onSubmit, onCancel }) => {
  const [values, setValues] = React.useState({ ...defaultValues, ...initialValues });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [preview, setPreview] = React.useState("");

  React.useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      const existingThumb =
        initialValues.imageUrl || initialValues.image || initialValues.thumbnailUrl || "";

      const mappedValues = {
        name: initialValues.name || "",
        description: initialValues.description || "",
        category: initialValues.category || "",
        privacy: initialValues.isPublic === false ? "private" : "public",

        thumbnailMode: existingThumb ? "url" : "upload",
        thumbnailUrl: existingThumb || "",
        thumbnailFile: null,
      };

      setValues(mappedValues);
      setPreview(existingThumb || "");
    } else {
      setValues({ ...defaultValues });
      setPreview("");
    }
  }, [initialValues, mode]);

  const handleChange = (field) => (e) => setValues((p) => ({ ...p, [field]: e.target.value }));
  const setField = (field, val) => setValues((p) => ({ ...p, [field]: val }));

  const onPickFile = (e) => {
    const file = e.target.files?.[0] || null;
    setField("thumbnailFile", file);

    if (!file) {
      setPreview(values.thumbnailUrl || "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      setField("thumbnailFile", null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max size is 5MB.");
      e.target.value = "";
      setField("thumbnailFile", null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.name?.trim()) return alert("Please enter a community name.");
    if (!values.description?.trim()) return alert("Please enter a description.");
    if (!values.category) return alert("Please select a category.");

    if (values.thumbnailMode === "upload") {
      if (!values.thumbnailFile) return alert("Please upload a thumbnail image.");
    } else {
      if (!values.thumbnailUrl?.trim()) return alert("Please paste a thumbnail image URL.");
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({
        name: values.name,
        description: values.description,
        category: values.category,
        privacy: values.privacy,

        thumbnailMode: values.thumbnailMode,
        thumbnailUrl: values.thumbnailUrl,
        thumbnailFile: values.thumbnailFile,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
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

      {/* ✅ Thumbnail */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-slate-700">Thumbnail</p>

          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setField("thumbnailMode", "upload");
                setField("thumbnailUrl", "");
              }}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md ${
                values.thumbnailMode === "upload"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setField("thumbnailMode", "url");
                setField("thumbnailFile", null);
                setPreview(values.thumbnailUrl || preview || "");
              }}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md ${
                values.thumbnailMode === "url"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Paste URL
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 bg-slate-50">
            {preview ? (
              <img src={preview} alt="Thumbnail preview" className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="flex-1">
            {values.thumbnailMode === "upload" ? (
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="block w-full rounded-xl bg-white/80 px-3 py-2 text-[12px] text-slate-700 ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-emerald-300"
              />
            ) : (
              <TextField
                label=""
                value={values.thumbnailUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setField("thumbnailUrl", v);
                  setPreview(v);
                }}
                placeholder="https://example.com/thumbnail.png"
              />
            )}
            <p className="mt-1 text-[10px] text-slate-500">Max 5MB. JPG/PNG/WebP recommended.</p>
          </div>
        </div>
      </div>

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
          {isSubmitting ? (mode === "create" ? "Adding..." : "Saving...") : mode === "create" ? "Add Community" : "Save Changes"}
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
