#include <node.h>
#include <v8.h>

namespace demo {

  using v8::Exception;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::MaybeLocal;
  using v8::Context;

  void Method(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Hello, World!").ToLocalChecked());
  }

  void Echo(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.Length() < 1) {
      isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong number of arguments").ToLocalChecked()));
      return;
    }

    if (!args[0]->IsString()) {
      isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    Local<Context> context = isolate->GetCurrentContext();
    Local<String> input = args[0]->ToString(context).ToLocalChecked();
    args.GetReturnValue().Set(input);
  }


  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "hello", Method);
    NODE_SET_METHOD(exports, "echo", Echo);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}
