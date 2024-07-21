#include <nan.h>
#include <windows.h>

#define DRIVE_LETTER "D:"

#pragma comment(lib, "winmm.lib")

namespace mci {
  DWORD OpenCd_(MCI_OPEN_PARMS *pMciOpenParms) {
    pMciOpenParms->lpstrDeviceType = "cdaudio";
    pMciOpenParms->lpstrElementName =  DRIVE_LETTER;
    return mciSendCommand(0, MCI_OPEN, MCI_OPEN_TYPE, (DWORD_PTR)pMciOpenParms);
  }

  DWORD GetTrackCount_(MCIDEVICEID wDeviceID, MCI_STATUS_PARMS *pMciStatusParms) {
    pMciStatusParms->dwItem = MCI_STATUS_NUMBER_OF_TRACKS;
    DWORD dwStatus = mciSendCommand(wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR)pMciStatusParms);
    return dwStatus;
  }

  DWORD CloseCd_(MCIDEVICEID wDeviceID, MCI_GENERIC_PARMS *pMciGenericParms) {
    return mciSendCommand(wDeviceID, MCI_CLOSE, 0, (DWORD_PTR)pMciGenericParms);
  }

  MCI_STATUS_PARMS mciStatusParms;
  MCI_GENERIC_PARMS mciGenericParms;
  MCI_OPEN_PARMS mciOpenParms;
  MCI_PLAY_PARMS mciPlayParms;
  MCIDEVICEID wDeviceID;

  // --

  NAN_METHOD(OpenCd) {
    info.GetReturnValue().Set(Nan::New(OpenCd_(&mciOpenParms) != 0));
  }

  NAN_METHOD(GetTrackCount) {
    if (GetTrackCount_(mciOpenParms.wDeviceID, &mciStatusParms)) {
      Nan::ThrowError("Error getting track count");
    }
    info.GetReturnValue().Set(Nan::New((int32_t) mciStatusParms.dwReturn));
  }

  NAN_METHOD(CloseCd) {
    info.GetReturnValue().Set(Nan::New(CloseCd_(mciOpenParms.wDeviceID, &mciGenericParms) != 0));
  }

  NAN_MODULE_INIT(init) {
    Nan::SetMethod(target, "openCd", OpenCd);
    Nan::SetMethod(target, "getTrackCount", GetTrackCount);
    Nan::SetMethod(target, "closeCd", CloseCd);
  }

  NODE_MODULE(addon, init)

}
