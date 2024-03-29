import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imgUploadProgress, setimgUploadProgress] = useState(null);
  const [imgUploadProgressError, setimgUploadProgressError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const handleImgUpload = () => {
    try {
      if (!file) {
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file?.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setimgUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimgUploadProgress(null);
          setimgUploadProgressError("Image failed to upload");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({
              ...formData,
              image: downloadUrl,
            });
            setimgUploadProgress(null);
            setimgUploadProgressError(null);
          });
        }
      );
    } catch (error) {
      setimgUploadProgressError("Image failed to upload");
    }
  };

  const onSubmitPost = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/api/post/create", formData)
        .then((res) => {
          if (res.status === 200 && res.data) {
            setPublishError(null);
            const slug = res.data?.post?.slug;
            navigate(`/post/${slug}`);
          }
        })
        .catch((res) => {
          if (res?.response?.data?.success == false) {
            setPublishError(res?.response?.data?.message);
          }
        });
    } catch (error) {
      setPublishError(`something went wrong-${error?.message}`);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="flex-1"
          />
          <Select
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value={"uncategorized"}>Select a Category</option>
            <option value={"JavaScript"}>JavaScript</option>
            <option value={"Java"}>Java</option>
            <option value={"NextJs"}>NextJs</option>
            <option value={"Houses"}>Houses</option>
            <option value={"Gaming"}>Gaming</option>
            <option value={"Mobile"}>Mobile</option>
            <option value={"Education"}>Education</option>
            <option value={"Jobs"}>Jobs</option>
          </Select>
        </div>
        <div className="flex flex-col gap-4 border-4 border-teal-500 border-dotted p-3 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {imgUploadProgress ? (
              <div className="w-10 h-10 relative mx-auto sm:mx-0">
                <CircularProgressbar
                  value={imgUploadProgress}
                  styles={buildStyles({
                    textColor: `#50C878`,
                    textSize: "25px",
                    pathColor: `rgba(80, 200, 120, ${imgUploadProgress / 100})`,
                  })}
                  text={`${imgUploadProgress}%`}
                />
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleImgUpload}
                disabled={imgUploadProgress}
              >
                Upload
              </Button>
            )}
          </div>

          {formData?.image && (
            <div className="h-[400px] w-full mx-auto object-cover">
              <img
                src={formData.image}
                alt="upload"
                className="w-full h-full px-0 rounded-md"
              />
            </div>
          )}
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-10 text-gray-800 dark:text-white placeholder-inherit"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {imgUploadProgressError ||
          (publishError && (
            <Alert color={"failure"}>
              {imgUploadProgressError || publishError}
            </Alert>
          ))}
        <Button
          type="button"
          gradientDuoTone={"purpleToPink"}
          size="sm"
          onClick={onSubmitPost}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
