// CreatePost.js
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { TiFolderAdd } from "react-icons/ti";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../config/FireBaseUrl";
import axios from "axios";
import { useAuthContext } from "../AtuhContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("check img", img);
  }, [img]);

  const handleOnChangeImage = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImg({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };
  const handleCancel = () => {
    // Xóa ảnh và file đã chọn
    setImg(null);
    setFile(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    setImg({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePost = async () => {
    try {
      if (img !== null) {
        const imgRef = ref(imageDb, `files/${v4()}`);
        const snapshot = await uploadBytes(imgRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setImgUrl(url);

        // Sau khi URL được tải xuống thành công, gửi yêu cầu đến máy chủ
        const body = { img: url.toString(), user_id: authUser._id };
        const response = await axios.post(
          "http://localhost:8000/photos/new",
          body
        );
        if (response) {
          toast.success("Tạo bài viết thành công");
          setImgUrl(null);
          setImg(null);
          setFile(null);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Tạo bài viết không thành công");
      console.log(error);
    }
  };

  return (
    <>
      <div className="create-post">Tạo bài đăng</div>
      {!img ? (
        <div
          className="create-image"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="create-image-child">
            <div className="add-button">
              <div className="icon-tifolder text-2xl">
                <TiFolderAdd className="TiFolderAdd" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => handleOnChangeImage(e)}
              />
              <div className="add-image">Thêm ảnh/video</div>
              <div className="pull-image">hoặc kéo và thả</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="create-image">
          <img className="create-image-image" src={img.url} alt={img.name} />
        </div>
      )}
      <div className="button-container">
        <div className="cancel-button" onClick={handleCancel}>
          Cancel
        </div>
        <div className="post-button" onClick={handlePost}>
          Đăng bài
        </div>
      </div>
    </>
  );
};

export default CreatePost;
