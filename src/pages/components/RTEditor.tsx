import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Button, message, Upload} from "antd";

let uploadMessage: any = null;
let uploadFileNumber = 0;

const RTEditor: React.FC<any> = (props) => {
  let editorRef: any = useRef(null);
  let uploadRef: any = useRef(null);
  const [reportEditorDisabled, setReportEditorDisabled] = useState(false);

  const modules: any = useMemo( // useMemo: 解决自定义失焦问题
    () => ({
      toolbar: {
        container: [
          [{'font': []}],
          [{'header': [1, 2, false]}],
          [{'size': []}],
          [{'color': []}, {'background': []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          [{'script': 'sub' }, {'script': 'super' }], // 上下标
          // [{'align': []}],
          ['link', 'image', /**'video'**/],
          ['clean'],
        ],
        handlers: {
          image: () => {
            uploadRef.current.click()
          },
        },
      },
    }),
    [],
  );

  const options: any = {
    placeholder: '',
    theme: 'snow',
    readOnly: false, // 是否只读
    className: 'ql-editor', //组件要加上(className=“ql-editor”)样式类名,否则空格不回显
    modules: modules,
    ref: editorRef,
    style: {
      width: '100%',
      height: '500px',
      overflow: 'hidden',
      borderBottom: '1px solid #ccc',
    },
    onFocus: {

    }
  };

  return (
    <div>
      <ReactQuill
        readOnly={reportEditorDisabled}
        {...options}
      />
      <Upload
        name='file'//上传类型为file，若填image可能会报错
        multiple={true}
        action='/action/upload/uploadFile/'
        beforeUpload={() => {
          setReportEditorDisabled(true);
          uploadFileNumber++;
          if(!uploadMessage) {
            uploadMessage = message.loading('Uploading...', 0);
          }
        }}
        onChange={(info) => {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }

          if (info.file.status === 'removed') { //移除文件

          } else if (info.file.status === 'done') { //上传完成
            if (info.file.response.id > 0) { //上传成功
              message.success(`${info.file.name} file uploaded successfully`);
              let quill = editorRef.current?.getEditor(); //获取到编辑器本身
              const cursorPosition = quill.getSelection().index; //获取当前光标位置
              const link = '/' + info.file.response.url; // 图片链接
              console.log("link = "+link);
              quill.insertEmbed(cursorPosition, 'image', link); //插入图片
              quill.setSelection(cursorPosition + 1); //光标位置加1
            } else { //上传失败
              message.error(info.file.response.Content ?? `${info.file.name} file uploaded failed`);
            }
            uploadFileNumber--;
            if(uploadFileNumber === 0) {
              if(uploadMessage) {
                uploadMessage();
                uploadMessage = null;
              }
              setReportEditorDisabled(false);
            }
          } else if (info.file.status === 'error') { //上传错误
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
        showUploadList={false}//隐藏上传列表。为true时上传会转圈圈
      >
        <Button ref={uploadRef} style={{ display: 'none' }}>
          Click to Upload
        </Button>
      </Upload>
    </div>
  );
};

export default RTEditor;
