#include <napi.h>
#include <windows.h>

#include "CdPlayer.h"
#include "CdPlayerException.h"

#define DRIVE_LETTER "D:"

#pragma comment(lib, "winmm.lib")

namespace mci {
  CdPlayer cdPlayer;

  Napi::Value OpenCd(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::Boolean::New(env, cdPlayer.OpenCd());
  }

  Napi::Value GetTrackCount(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    try {
      return Napi::Number::New(env, cdPlayer.GetTrackCount());
    } catch (CdPlayerException &e) {
      Napi::TypeError::New(env, "Error getting track count").ThrowAsJavaScriptException();
      return env.Null();
    }
  }

  Napi::Value CloseCd(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::Boolean::New(env, cdPlayer.CloseCd());
  }

  Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "openCd"), Napi::Function::New(env, OpenCd));
    exports.Set(Napi::String::New(env, "getTrackCount"), Napi::Function::New(env, GetTrackCount));
    exports.Set(Napi::String::New(env, "closeCd"), Napi::Function::New(env, CloseCd));
    return exports;
  }

  NODE_API_MODULE(addon, Init)
}
