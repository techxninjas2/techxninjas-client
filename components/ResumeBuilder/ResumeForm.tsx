import { useForm } from "react-hook-form";
import { useResume } from "../../contexts/ResumeContext";
import { ResumeData } from "../../contexts/ResumeContext";




export default function ResumeForm() {
  const { register, handleSubmit } = useForm<ResumeData>();
  const { setResumeData } = useResume();

  const onSubmit = (data: ResumeData) => {
    setResumeData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
  <h2 className="text-xl font-semibold">Personal Details</h2>

  {/* Name Row */}
  <div className="grid grid-cols-2 gap-4">
    <input {...register("firstName")} placeholder="First name" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("surname")} placeholder="Surname" className="border p-2 rounded text-black dark:text-black" />
  </div>

  {/* Location Row */}
  <div className="grid grid-cols-3 gap-4">
    <input {...register("city")} placeholder="City" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("country")} placeholder="Country" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("pinCode")} placeholder="Pin code" className="border p-2 rounded text-black dark:text-black" />
  </div>

  {/* Contact Row */}
  <div className="grid grid-cols-2 gap-4">
    <input {...register("phone")} placeholder="Phone" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("email")} placeholder="Email" className="border p-2 rounded col-span-1 text-black dark:text-black" />
  </div>

  <h2 className="text-xl font-semibold pt-4">Experience</h2>
  <div className="grid grid-cols-2 gap-4">
    <input {...register("experienceRole")} placeholder="Role" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("experienceCompany")} placeholder="Company" className="border p-2 rounded text-black dark:text-black" />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <input {...register("startDate")} placeholder="Start Date" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("endDate")} placeholder="End Date" className="border p-2 rounded text-black dark:text-black" />
  </div>
  <input {...register("location")} placeholder="Location" className="border p-2 rounded w-full text-black dark:text-black" />
  <textarea {...register("description")} placeholder="Description" className="border p-2 rounded w-full text-black dark:text-black" />

  <h2 className="text-xl font-semibold pt-4">Education</h2>
  <div className="grid grid-cols-2 gap-4">
    <input {...register("degree")} placeholder="Degree" className="border p-2 rounded text-black dark:text-black" />
    <input {...register("institution")} placeholder="Institution" className="border p-2 rounded text-black dark:text-black" />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <input {...register("eduStart")} placeholder="Start Year" className="border p-2 rounded text-text-black dark:text-black" />
    <input {...register("eduEnd")} placeholder="End Year" className="border p-2 rounded text-black dark:text-black" />
  </div>

  <h2 className="text-xl font-semibold pt-4">Projects</h2>
  <textarea {...register("Projdescription")} placeholder="Description" className="border p-2 rounded w-full text-black dark:text-black" />


  <h2 className="text-xl font-semibold pt-4">Skills</h2>
  <input {...register("skills")} placeholder="Skills (comma separated)" className="border p-2 rounded w-full text-black dark:text-black" />


  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Update Preview
  </button>
</form>

  );
}
