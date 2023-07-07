import React, {useState, useRef, useMemo, useEffect} from 'react';
import {Button, message, Upload} from "antd";
import ReactQuill, {Quill} from 'react-quill-with-table';
import QuillBetterTable from 'quill-better-table';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill-with-table/dist/quill.snow.css';
import "quill-better-table/dist/quill-better-table.css";

let uploadMessage: any = null;
let uploadFileNumber = 0;

const ReactQuillWithTableEditor: React.FC<any> = (props) => {
  let editorRef: any = useRef(null);
  let uploadRef: any = useRef(null);
  const [reportEditorDisabled, setReportEditorDisabled] = useState(false);

  Quill.register('modules/imageResize', ImageResize);
  Quill.register({'modules/better-table': QuillBetterTable}, true);
  // window.katex = katex;

  const insertTable = () => {
    const editor = editorRef.current.getEditor();
    const tableModule = editor.getModule("better-table");
    tableModule.insertTable(3, 3);
  };

  useEffect(() => {
    const editor = editorRef.current.getEditor();
    const toolbar = editor.getModule("toolbar");
    toolbar.addHandler("table", () => {
      insertTable();
    });
  }, []);

  const modules: any = useMemo( // useMemo: 解决自定义失焦问题
    () => ({
      toolbar: {
        container: [
          [
            {'font': []},
            {'header': [1, 2, false]},
            {'size': []}
          ],
          [
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            {'script': 'sub' }, {'script': 'super' },
            {'color': []}, {'background': []}
          ],
          [
            {'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'},
            {'align': []}
          ],
          ['link', 'image', /**'video'**/],
          ['table'],
          ['clean'],
        ],
        handlers: {
          image: () => {
            uploadRef.current.click()
          },
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      },
      table: false,
      "better-table": {
        operationMenu: {
          items: {
            unmergeCells: {
              text: "Another unmerge cells name"
            }
          }
        }
      },
      keyboard: {
        bindings: QuillBetterTable.keyboardBindings
      },
    }),
    [],
  );

  const options: any = {
    placeholder: '',
    theme: 'snow',
    // className: 'ql-editor', //组件要加上(className=“ql-editor”)样式类名,否则空格不回显
    modules: modules,
    ref: editorRef,
    // style: {
    //   width: '100%',
    //   height: '500px',
    //   overflow: 'hidden',
    //   borderBottom: '1px solid #ccc',
    // }
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

export default ReactQuillWithTableEditor;
