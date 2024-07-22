#include <windows.h>
#include "CdPlayer.h"
#include "CdPlayerException.h"
#define DRIVE_LETTER "D:"

namespace mci {
  CdPlayer::CdPlayer()
  : mciStatusParms({}),
    mciGenericParms({}),
    mciOpenParms({}),
    mciPlayParms({}),
    mciSetParms({})
  {
  }

  CdPlayer::~CdPlayer() {
    CloseCd();
  }

  bool CdPlayer::OpenCd() {
    return _OpenCd() == 0;
  }

  int CdPlayer::GetTrackCount() {
    if (_GetTrackCount()) {
      throw CdPlayerException("Error getting track count");
    }
    return (int) mciStatusParms.dwReturn;
  }

  bool CdPlayer::CloseCd() {
    return _CloseCd() == 0;
  }

  void CdPlayer::Play(int track) {
    Stop();
    if (_Play(GetTrackStart(track))) {
      CloseCd();
      throw CdPlayerException("Error playing track");
    }
  }

  void CdPlayer::Stop() {
    _Stop();
  }

  void CdPlayer::Pause() {
    _Pause();
  }

  void CdPlayer::Resume() {
    _Resume();
  }

  int CdPlayer::GetCurrentTrackNumber() {
    if (_GetCurrentTrackNumber()) {
      CloseCd();
      throw CdPlayerException("Error getting current track number");
    }
    return (int) mciStatusParms.dwReturn;
  }

  unsigned long CdPlayer::GetTrackLength(int track) {
    _SetMciSetFormat(MCI_FORMAT_MSF);
    if (_GetTrackLength(track)) {
      CloseCd();
      throw CdPlayerException("Error getting track length");
    }
    return ConvertToMilliseconds(mciStatusParms.dwReturn);
  }

  unsigned long CdPlayer::GetCurrentPosition() {
    if (_SetMciSetFormat(MCI_FORMAT_MSF)) {
      CloseCd();
      throw CdPlayerException("Error setting time format");
    }

    if (_GetCurrentTrackNumber()) {
      CloseCd();
      throw CdPlayerException("Error getting current track number");
    }
    DWORD dwCurrentTrackNumber = mciStatusParms.dwReturn;

    if (_GetCurrentPosition()) {
      CloseCd();
      throw CdPlayerException("Error getting current position");
    }
    DWORD dwCurrentPosition = mciStatusParms.dwReturn;

    if (_GetTrackStart(dwCurrentTrackNumber)) {
      CloseCd();
      throw CdPlayerException("Error getting track start");
    }
    DWORD dwCurrentTrackStartPosition = mciStatusParms.dwReturn;

    return ConvertToMilliseconds(dwCurrentPosition) - ConvertToMilliseconds(dwCurrentTrackStartPosition);
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

  DWORD CdPlayer::_GetTrackStart(DWORD dwTrack) {
    mciStatusParms.dwItem = MCI_STATUS_POSITION;
    mciStatusParms.dwTrack = dwTrack;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, (DWORD_PTR) &mciStatusParms);
  }

  DWORD CdPlayer::GetTrackStart(DWORD dwTrack) {
    if (_GetTrackStart(dwTrack)) {
      CloseCd();
      throw CdPlayerException("Error getting track start");
    }
    return mciStatusParms.dwReturn;
  }

  DWORD CdPlayer::_Play(DWORD dwTrackStart) {
    mciPlayParms.dwFrom = dwTrackStart;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_PLAY, MCI_FROM, (DWORD_PTR) &mciPlayParms);
  }

  DWORD CdPlayer::_Stop() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STOP, 0, (DWORD_PTR) &mciGenericParms);
  }

  DWORD CdPlayer::_Pause() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_PAUSE, 0, 0);
  }

  DWORD CdPlayer::_Resume() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_RESUME, 0, 0);
  }

  DWORD CdPlayer::_GetCurrentTrackNumber() {
    mciStatusParms.dwItem = MCI_STATUS_CURRENT_TRACK;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR) &mciStatusParms);
  }

  DWORD CdPlayer::_GetTrackLength(DWORD dwTrack) {
    mciStatusParms.dwItem = MCI_STATUS_LENGTH;
    mciStatusParms.dwTrack = dwTrack;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, (DWORD_PTR) &mciStatusParms);
  }

  DWORD CdPlayer::ConvertToMilliseconds(DWORD dwTime) {
    DWORD minutes = MCI_MSF_MINUTE(dwTime);
    DWORD seconds = MCI_MSF_SECOND(dwTime);
    DWORD frames = MCI_MSF_FRAME(dwTime);
    return (minutes * 60000) + (seconds * 1000) + (frames * (1000 / 75));
  }

  DWORD CdPlayer::_GetCurrentPosition() {
    mciStatusParms.dwItem = MCI_STATUS_POSITION;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, (DWORD_PTR) &mciStatusParms);
  }

  DWORD CdPlayer::_SetMciSetFormat(DWORD dwTimeFormat) {
    mciSetParms.dwTimeFormat = dwTimeFormat;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_SET, MCI_SET_TIME_FORMAT, (DWORD_PTR) &mciSetParms);
  }

} // mci