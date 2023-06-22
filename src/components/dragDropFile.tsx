import { httpAuthResHelper } from "../helper";
import { Button } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";

export default function DragDropFile({ handleFiles }) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAttachment(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadAttachment(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const uploadAttachment = (file) => {
    console.log("upload")
    var data = new FormData()
    data.append('attachment', file)
    fetch('/api/admin/uploadAttachment', {
      method: 'POST',
      body: data,
    }).then(httpAuthResHelper).then(e => e.json()).then(e => handleFiles(e))
  }

  return (
    <form className="h-[200px] rounded-lg border-dashed border-2 text-center relative" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input className="hidden" ref={inputRef} type="file" multiple={false} onChange={handleChange} />
      <label className={`flex items-center justify-center h-full ${dragActive ? "drag-active" : ""}`}>
        <div>
          <p>Drag and drop your file here or</p>
          <Button onClick={onButtonClick}>Upload a file</Button>
        </div>
      </label>
      {dragActive && <div className="absolute top-0 left-0 right-0 bottom-0 -z-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
    </form>
  );
};