#include <windows.h>
#include "CdPlayer.h"
#include "CdPlayerException.h"

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

  bool CdPlayer::OpenCd(const char *driveLetter) {
    return SendOpenCdCommand(&driveLetter) == 0;
  }

  int CdPlayer::GetTrackCount() {
    if (SendGetTrackCountCommand()) {
      throw CdPlayerException("Error getting track count");
    }
    return static_cast<int>(mciStatusParms.dwReturn);
  }

  bool CdPlayer::CloseCd() {
    return SendCloseCdCommand() == 0;
  }

  void CdPlayer::Play(const int track) {
    Stop();
    if (SendPlayCommand(GetTrackStart(track))) {
      CloseCd();
      throw CdPlayerException("Error playing track");
    }
  }

  void CdPlayer::Stop() {
    SendStopCommand();
  }

  void CdPlayer::Pause() {
    if (SendSetMciSetFormatCommand(MCI_FORMAT_MSF) != 0) {
      CloseCd();
      throw CdPlayerException("Error setting time format");
    }
    if (SendGetCurrentPositionCommand()) {
      CloseCd();
      throw CdPlayerException("Error getting current position");
    }
    DWORD_PTR dwPausedPosition = mciStatusParms.dwReturn;
    if (SendStopCommand()) {
      CloseCd();
      throw CdPlayerException("Error stopping playback");
    }
    if (SendSeekCommand(dwPausedPosition)) {
      CloseCd();
      throw CdPlayerException("Error seeking to paused position");
    }
  }

  void CdPlayer::Resume() {
    if (SendSetMciSetFormatCommand(MCI_FORMAT_MSF) != 0) {
      CloseCd();
      throw CdPlayerException("Error setting time format");
    }
    if (SendPlayCommand()) {
      CloseCd();
      throw CdPlayerException("Error resuming playback");
    }
  }

  int CdPlayer::GetCurrentTrackNumber() {
    if (SendGetCurrentTrackNumberCommand()) {
      CloseCd();
      throw CdPlayerException("Error getting current track number");
    }
    return static_cast<int>(mciStatusParms.dwReturn);
  }

  unsigned long CdPlayer::GetTrackLength(const int track) {
    SendSetMciSetFormatCommand(MCI_FORMAT_MSF);
    if (SendGetTrackLengthCommand(track)) {
      CloseCd();
      throw CdPlayerException("Error getting track length");
    }
    return ConvertToMilliseconds(mciStatusParms.dwReturn);
  }

  unsigned long CdPlayer::GetCurrentPosition() {
    if (SendSetMciSetFormatCommand(MCI_FORMAT_MSF)) {
      CloseCd();
      throw CdPlayerException("Error setting time format");
    }

    if (SendGetCurrentTrackNumberCommand()) {
      CloseCd();
      throw CdPlayerException("Error getting current track number");
    }
    DWORD dwCurrentTrackNumber = mciStatusParms.dwReturn;

    if (SendGetCurrentPositionCommand()) {
      CloseCd();
      throw CdPlayerException("Error getting current position");
    }
    DWORD dwCurrentPosition = mciStatusParms.dwReturn;

    if (SendGetTrackStartCommand(dwCurrentTrackNumber)) {
      CloseCd();
      throw CdPlayerException("Error getting track start");
    }
    DWORD dwCurrentTrackStartPosition = mciStatusParms.dwReturn;

    return ConvertToMilliseconds(dwCurrentPosition) - ConvertToMilliseconds(dwCurrentTrackStartPosition);
  }

  bool CdPlayer::EjectCd() {
    return SendEjectCdCommand() == 1;
  }

  DWORD CdPlayer::SendOpenCdCommand(const LPCSTR *lpstrDriveLetter) {
    mciOpenParms.lpstrDeviceType = "cdaudio";
    mciOpenParms.lpstrElementName = *lpstrDriveLetter;
    return mciSendCommand(0, MCI_OPEN, MCI_OPEN_TYPE | MCI_OPEN_ELEMENT, reinterpret_cast<DWORD_PTR>(&mciOpenParms));
  }

  DWORD CdPlayer::SendGetTrackCountCommand() {
    mciStatusParms.dwItem = MCI_STATUS_NUMBER_OF_TRACKS;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, reinterpret_cast<DWORD_PTR>(&mciStatusParms));
  }

  DWORD CdPlayer::SendCloseCdCommand() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_CLOSE, 0, reinterpret_cast<DWORD_PTR>(&mciGenericParms));
  }

  DWORD CdPlayer::SendGetTrackStartCommand(DWORD dwTrack) {
    mciStatusParms.dwItem = MCI_STATUS_POSITION;
    mciStatusParms.dwTrack = dwTrack;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, reinterpret_cast<DWORD_PTR>(&mciStatusParms));
  }

  DWORD CdPlayer::GetTrackStart(DWORD dwTrack) {
    if (SendGetTrackStartCommand(dwTrack)) {
      CloseCd();
      throw CdPlayerException("Error getting track start");
    }
    return mciStatusParms.dwReturn;
  }

  DWORD CdPlayer::SendPlayCommand(DWORD dwTrackStart) {
    mciPlayParms.dwFrom = dwTrackStart;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_PLAY, MCI_FROM, reinterpret_cast<DWORD_PTR>(&mciPlayParms));
  }

  DWORD CdPlayer::SendPlayCommand() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_PLAY, 0, reinterpret_cast<DWORD_PTR>(&mciPlayParms));
  }

  DWORD CdPlayer::SendStopCommand() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STOP, 0, reinterpret_cast<DWORD_PTR>(&mciGenericParms));
  }

  DWORD CdPlayer::SendSeekCommand(DWORD dwTo) {
    MCI_SEEK_PARMS mciSeekParms = {};
    mciSeekParms.dwTo = dwTo;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_SEEK, MCI_TO, reinterpret_cast<DWORD_PTR>(&mciSeekParms));
  }

  DWORD CdPlayer::SendGetCurrentTrackNumberCommand() {
    mciStatusParms.dwItem = MCI_STATUS_CURRENT_TRACK;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, reinterpret_cast<DWORD_PTR>(&mciStatusParms));
  }

  DWORD CdPlayer::SendGetTrackLengthCommand(DWORD dwTrack) {
    mciStatusParms.dwItem = MCI_STATUS_LENGTH;
    mciStatusParms.dwTrack = dwTrack;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM | MCI_TRACK, reinterpret_cast<DWORD_PTR>(&mciStatusParms));
  }

  DWORD CdPlayer::ConvertToMilliseconds(const DWORD dwTime) {
    DWORD minutes = MCI_MSF_MINUTE(dwTime);
    DWORD seconds = MCI_MSF_SECOND(dwTime);
    DWORD frames = MCI_MSF_FRAME(dwTime);
    return (minutes * 60000) + (seconds * 1000) + (frames * (1000 / 75));
  }

  DWORD CdPlayer::SendGetCurrentPositionCommand() {
    mciStatusParms.dwItem = MCI_STATUS_POSITION;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_STATUS, MCI_STATUS_ITEM, reinterpret_cast<DWORD_PTR>(&mciStatusParms));
  }

  DWORD CdPlayer::SendSetMciSetFormatCommand(const DWORD dwTimeFormat) {
    mciSetParms.dwTimeFormat = dwTimeFormat;
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_SET, MCI_SET_TIME_FORMAT, reinterpret_cast<DWORD_PTR>(&mciSetParms));
  }

  DWORD CdPlayer::SendEjectCdCommand() {
    return mciSendCommand(mciOpenParms.wDeviceID, MCI_SET, MCI_SET_DOOR_OPEN, reinterpret_cast<DWORD_PTR>(&mciGenericParms));
  }

}
