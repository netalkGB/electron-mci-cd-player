#include <node.h>
#include <v8.h>
#include  <windows.h>
#include <iostream>
#include <string>

#define DRIVE_LETTER "D:"

#pragma comment(lib, "winmm.lib")

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

  DWORD OpenCd(MCI_OPEN_PARMS *pMciOpenParms) {
      pMciOpenParms->lpstrDeviceType = "cdaudio";
      pMciOpenParms->lpstrElementName =  DRIVE_LETTER;
      return mciSendCommand(0, MCI_OPEN, MCI_OPEN_TYPE, (DWORD_PTR)pMciOpenParms);
  }

  DWORD GetTrackCount(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms) {
      pMciStatusParms->dwItem = MCI_STATUS_NUMBER_OF_TRACKS;
      DWORD dwStatus = mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR)pMciStatusParms);
      return dwStatus;
  }

  DWORD GetTrackStart(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms, DWORD dwTrack) {
      pMciStatusParms->dwItem = MCI_STATUS_POSITION;
      pMciStatusParms->dwTrack = dwTrack;
      return mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, (DWORD_PTR)pMciStatusParms);
  }

  DWORD Play(MCIDEVICEID wDeviceID, MCI_PLAY_PARMS *pMciPlayParms, DWORD dwTrackStart) {
      pMciPlayParms->dwFrom = dwTrackStart;
      return mciSendCommand(wDeviceID, MCI_PLAY, MCI_FROM, (DWORD_PTR)pMciPlayParms);
  }

  DWORD Stop(MCIDEVICEID wDeviceID, MCI_GENERIC_PARMS *pMciGenericParms) {
      return mciSendCommand(wDeviceID, MCI_STOP, 0, (DWORD_PTR)pMciGenericParms);
  }

  DWORD Pause(MCIDEVICEID wDeviceID) {
      return mciSendCommand(wDeviceID, MCI_PAUSE, 0, 0);
  }

  DWORD Resume(MCIDEVICEID wDeviceID) {
      return mciSendCommand(wDeviceID, MCI_RESUME, 0, 0);
  }

  DWORD CloseCd(MCIDEVICEID wDeviceID, MCI_GENERIC_PARMS *pMciGenericParms) {
      return mciSendCommand(wDeviceID, MCI_CLOSE, 0, (DWORD_PTR)pMciGenericParms);
  }

  DWORD GetCurrentTrackNumber(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms) {
      pMciStatusParms->dwItem = MCI_STATUS_CURRENT_TRACK;
      return mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR)pMciStatusParms);
  }

  DWORD GetTrackLength(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms, DWORD dwTrack) {
      pMciStatusParms->dwItem = MCI_STATUS_LENGTH;
      pMciStatusParms->dwTrack = dwTrack;
      return mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, (DWORD_PTR)pMciStatusParms);
  }

  DWORD GetCurrentPosition(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms) {
      pMciStatusParms->dwItem = MCI_STATUS_POSITION;
      return mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR)pMciStatusParms);
  }

  DWORD ConvertToMilliseconds(DWORD time) {
      DWORD minutes = MCI_MSF_MINUTE(time);
      DWORD seconds = MCI_MSF_SECOND(time);
      DWORD frames = MCI_MSF_FRAME(time);
      return (minutes * 60000) + (seconds * 1000) + (frames * (1000 / 75));
  }

  MCI_STATUS_PARMS mciStatusParms;
  MCI_GENERIC_PARMS mciGenericParms;
  MCI_OPEN_PARMS mciOpenParms;
  MCI_PLAY_PARMS mciPlayParms;
  MCIDEVICEID wDeviceID;

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

  void OpenCd_(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    auto status = OpenCd(&mciOpenParms);
    if (status) {
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate, "Could not open CD drive.").ToLocalChecked()));
      return;
    }
    wDeviceID = mciOpenParms.wDeviceID;
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "ok").ToLocalChecked()); // TODO: 戻り値はStringではないほうがいい
  }

  void GetTrackCount_(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    if (DWORD dwStatus = GetTrackCount(wDeviceID, &mciStatusParms)) {
      CloseCd(wDeviceID, &mciGenericParms);
      isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate, "The number of tracks could not be retrieved.").ToLocalChecked()));
      return;
    }
    DWORD numTracks = (DWORD) mciStatusParms.dwReturn;
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, std::to_string(numTracks).c_str()).ToLocalChecked()); // TODO: 戻り値はStringではないほうがいい
  }

  
  void CloseCd_(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    CloseCd(wDeviceID, &mciGenericParms);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "ok").ToLocalChecked()); // TODO: 戻り値はStringではないほうがいい
  }

  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "hello", Method);
    NODE_SET_METHOD(exports, "echo", Echo);

    NODE_SET_METHOD(exports, "openCd", OpenCd_);
    NODE_SET_METHOD(exports, "getTrackCount", GetTrackCount_);
    NODE_SET_METHOD(exports, "closeCd", CloseCd_);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}
