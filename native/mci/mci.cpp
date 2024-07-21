#include <nan.h>
#include <windows.h>

#include "CdPlayer.h"
#include "CdPlayerException.h"

#define DRIVE_LETTER "D:"

#pragma comment(lib, "winmm.lib")

namespace mci {
  CdPlayer *cdPlayer;

  NAN_METHOD(OpenCd) {
    info.GetReturnValue().Set(Nan::New(cdPlayer->OpenCd()));
  }

  NAN_METHOD(GetTrackCount) {
    try {
      info.GetReturnValue().Set(Nan::New(cdPlayer->GetTrackCount()));
    } catch (CdPlayerException &e) {
      Nan::ThrowError("Error getting track count");
    }
  }

  NAN_METHOD(CloseCd) {
    info.GetReturnValue().Set(Nan::New(cdPlayer->CloseCd()));
  }

  NAN_MODULE_INIT(init) {
    cdPlayer = new CdPlayer();
    Nan::SetMethod(target, "openCd", OpenCd);
    Nan::SetMethod(target, "getTrackCount", GetTrackCount);
    Nan::SetMethod(target, "closeCd", CloseCd);
  }

  NODE_MODULE(addon, init)

}
