"use client";

import { LanguagesType } from "@repo/i18n";
import { UploadDropzone } from "@repo/utils";

export default function Profile({ lng }: { lng: LanguagesType }) {
  return (
    <div className="w-full">
      <div>
        <h5>User Profile</h5>
        <p>Update your personal details here</p>
      </div>
      <div className="mx-auto my-6 w-full max-w-[28rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
        <div>
          <UploadDropzone
            endpoint="profileImageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={(name) => {
              // Do something once upload begins
              console.log("Uploading: ", name);
            }}
          />
        </div>
      </div>
    </div>
  );
}
