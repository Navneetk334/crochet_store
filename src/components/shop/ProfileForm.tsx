"use client";

import { useState, memo } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Check,
  AlertCircle,
  X,
  Upload,
  HardDrive,
} from "lucide-react";

interface ProfileFormProps {
  user: any;
  sessionUser: any;
  updateAction: (formData: FormData) => Promise<void>;
}

function ProfileForm({ user, sessionUser, updateAction }: ProfileFormProps) {
  const [imageUrl, setImageUrl] = useState(
    user?.image || sessionUser?.image || ""
  );
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setIsModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      formData.set("phone", phone);
      formData.set("image", imageUrl);
      await updateAction(formData);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <form
        action={handleSubmit}
        className="bg-white rounded-3xl p-10 border border-pebble shadow-sm space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-pebble pb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-pebble overflow-hidden border shadow-sm relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Profile"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <User size={50} strokeWidth={1} />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Camera size={22} />
            </button>

            <input type="hidden" name="image" value={imageUrl} />
          </div>

          <div className="text-center md:text-left space-y-1">
            <h4 className="font-serif text-3xl text-charcoal">
              {user?.name || sessionUser?.name || "Artisan Guest"}
            </h4>
            <p className="text-earth-brown/60 text-sm italic">
              "Capturing your creative journey."
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={user?.name || sessionUser?.name || ""}
              className="w-full px-5 py-4 bg-pebble/30 rounded-2xl focus:bg-white focus:border-sage outline-none text-sm border border-transparent"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || sessionUser?.email || ""}
              className="w-full px-5 py-4 bg-pebble/30 rounded-2xl focus:bg-white focus:border-sage outline-none text-sm border border-transparent"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
              Mobile
            </label>
            <input
              name="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="0000000000"
              className="w-full px-5 py-4 bg-pebble/30 rounded-2xl focus:bg-white focus:border-sage outline-none text-sm border border-transparent tracking-widest"
            />

            {phone.length > 0 && phone.length < 10 && (
              <p className="text-[10px] text-terra mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> 10 digits required
              </p>
            )}
          </div>

          <div className="opacity-50">
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
              Artisan Tier
            </label>
            <div className="w-full px-5 py-4 bg-pebble/20 rounded-2xl text-sm flex justify-between items-center">
              <span>Golden Thread</span>
              <Check size={14} className="text-sage" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-8 border-t border-pebble">
          <p className="text-[10px] text-earth-brown/40 uppercase tracking-widest">
            Your details are securely stored.
          </p>

          <button
            type="submit"
            disabled={isSaving || (phone.length > 0 && phone.length < 10)}
            className="btn-primary py-3 px-10 rounded-2xl text-[11px] uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border p-8 space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-charcoal/40 hover:text-charcoal"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-serif">Select Profile Image</h2>

            <label className="block bg-pebble/30 p-8 rounded-2xl text-center cursor-pointer hover:bg-pebble transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload size={28} className="mx-auto mb-2" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Upload from Device
              </span>
            </label>

            <button
              type="button"
              className="block w-full bg-pebble/20 p-8 rounded-2xl text-center opacity-50 cursor-not-allowed"
            >
              <HardDrive size={28} className="mx-auto mb-2" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Google Drive (Soon)
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ProfileForm);