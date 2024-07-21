#include <windows.h>
#include "CdPlayer.h"
#include "CdPlayerException.h"
#define DRIVE_LETTER "D:"

namespace mci {
  CdPlayer::CdPlayer()
  : mciStatusParms({}),
    mciGenericParms({}),
    mciOpenParms({}),
    mciPlayParms({})
  {
  }

  CdPlayer::~CdPlayer() {
    CloseCd();
  }

  bool CdPlayer::OpenCd() {
    return _OpenCd() != 0;
  }

  int CdPlayer::GetTrackCount() {
    if (_GetTrackCount()) {
      throw CdPlayerException("Error getting track count");
    }
    return (int) mciStatusParms.dwReturn;
  }

  bool CdPlayer::CloseCd() {
    return _CloseCd() != 0;
  }

  DWORD CdPlayer::_OpenCd() {
    mciOpenParms.lpstrDeviceType = "cdaudio";
    mciOpenParms.lpstrElementName =  DRIVE_LETTER;
    return mciSendCommand(0, MCI_OPEN, MCI_OPEN_TYPE, (DWORD_PTR) &mciOpenParms);
  }

  DWORD CdPlayer::_GetTrackCount() {
    mciStatusParms.dwItem = MCI_STATUS_NUMBER_OF_TRACKS;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR) &mciStatusParms);
  }

  DWORD CdPlayer::_CloseCd() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_CLOSE, 0, (DWORD_PTR) &mciGenericParms);
  }
} // mci