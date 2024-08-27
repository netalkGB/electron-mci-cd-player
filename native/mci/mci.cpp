#include <vector>
#include <napi.h>
#include <windows.h>

#include "CdPlayer.h"
#include "CdPlayerException.h"
#include "CdPlayerUtil.h"

#define DRIVE_LETTER "D:"

#pragma comment(lib, "winmm.lib")

namespace mci {
  CdPlayer cdPlayer;

  Napi::Value GetDriveLetters(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::vector<char> driveLetters = CdPlayerUtil::GetDriveLetters();
    Napi::Array result = Napi::Array::New(env, driveLetters.size());
    for (size_t i = 0; i < driveLetters.size(); ++i) {
      result[i] = Napi::String::New(env, std::string(1, driveLetters[i]));
    }
    return result;
  }

  Napi::Value OpenCd(const Napi::CallbackInfo& info) {
    return Napi::Boolean::New(info.Env(), cdPlayer.OpenCd());
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
    return Napi::Boolean::New(info.Env(), cdPlayer.CloseCd());
  }

  Napi::Value Play(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
      Napi::TypeError::New(env, "Expected a number as the first argument").ThrowAsJavaScriptException();
      return env.Null();
    }
    int trackNumber = info[0].As<Napi::Number>().Int32Value();
    try {
      cdPlayer.Play(trackNumber);
      return Napi::Boolean::New(env, true);
    } catch (CdPlayerException &e) {
      Napi::TypeError::New(env, "Error playing track").ThrowAsJavaScriptException();
      return env.Null();
    }
  }

  Napi::Value Stop(const Napi::CallbackInfo& info) {
    cdPlayer.Stop();
    return info.Env().Null();
  }

  Napi::Value Pause(const Napi::CallbackInfo& info) {
    cdPlayer.Pause();
    return info.Env().Null();
  }

  Napi::Value Resume(const Napi::CallbackInfo& info) {
    cdPlayer.Resume();
    return info.Env().Null();
  }

  Napi::Value GetCurrentTrackNumber(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    try {
      return Napi::Number::New(env, cdPlayer.GetCurrentTrackNumber());
    } catch (CdPlayerException &e) {
      Napi::TypeError::New(env, "Error getting current track number").ThrowAsJavaScriptException();
      return env.Null();
    }
  }

  Napi::Value GetTrackLength(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
      Napi::TypeError::New(env, "Expected a number as the first argument").ThrowAsJavaScriptException();
      return env.Null();
    }
    int trackNumber = info[0].As<Napi::Number>().Int32Value();
    try {
      return Napi::Number::New(env, cdPlayer.GetTrackLength(trackNumber));
    } catch (CdPlayerException &e) {
      Napi::TypeError::New(env, "Error getting track length").ThrowAsJavaScriptException();
      return env.Null();
    }
  }

  Napi::Value GetCurrentPosition(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    try {
      return Napi::Number::New(env, cdPlayer.GetCurrentPosition());
    } catch (CdPlayerException &e) {
      Napi::TypeError::New(env, "Error getting current position").ThrowAsJavaScriptException();
      return env.Null();
    }
  }

  Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getDriveLetters"), Napi::Function::New(env, GetDriveLetters));
    exports.Set(Napi::String::New(env, "openCd"), Napi::Function::New(env, OpenCd));
    exports.Set(Napi::String::New(env, "getTrackCount"), Napi::Function::New(env, GetTrackCount));
    exports.Set(Napi::String::New(env, "closeCd"), Napi::Function::New(env, CloseCd));
    exports.Set(Napi::String::New(env, "play"), Napi::Function::New(env, Play));
    exports.Set(Napi::String::New(env, "stop"), Napi::Function::New(env, Stop));
    exports.Set(Napi::String::New(env, "pause"), Napi::Function::New(env, Pause));
    exports.Set(Napi::String::New(env, "resume"), Napi::Function::New(env, Resume));
    exports.Set(Napi::String::New(env, "getCurrentTrackNumber"), Napi::Function::New(env, GetCurrentTrackNumber));
    exports.Set(Napi::String::New(env, "getTrackLength"), Napi::Function::New(env, GetTrackLength));
    exports.Set(Napi::String::New(env, "getCurrentPosition"), Napi::Function::New(env, GetCurrentPosition));
    return exports;
  }

  NODE_API_MODULE(addon, Init)
}
