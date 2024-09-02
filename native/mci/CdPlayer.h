#ifndef CDPLAYER_H
#define CDPLAYER_H

#include <windows.h>

namespace mci {

class CdPlayer {
public:
  CdPlayer();
  ~CdPlayer();
  bool OpenCd(const char *driveLetter);
  int GetTrackCount();
  bool CloseCd();
  void Play(int track);
  void Stop();
  void Pause();
  void Resume();
  int GetCurrentTrackNumber();
  unsigned long GetTrackLength(int track);
  unsigned long GetCurrentPosition();
  bool EjectCd();
private:
  MCI_STATUS_PARMS mciStatusParms;
  MCI_GENERIC_PARMS mciGenericParms;
  MCI_OPEN_PARMS mciOpenParms;
  MCI_PLAY_PARMS mciPlayParms;
  MCI_SET_PARMS mciSetParms;
  DWORD SendOpenCdCommand(const LPCSTR *lpstrDriveLetter);
  DWORD SendGetTrackCountCommand();
  DWORD SendCloseCdCommand();
  DWORD SendGetTrackStartCommand(DWORD dwTrack);
  DWORD GetTrackStart(DWORD dwTrack);
  DWORD SendPlayCommand(DWORD dwTrackStart);
  DWORD SendStopCommand();
  DWORD SendPauseCommand();
  DWORD SendResumeCommand();
  DWORD SendGetCurrentTrackNumberCommand();
  DWORD SendGetTrackLengthCommand(DWORD dwTrack);
  DWORD ConvertToMilliseconds(DWORD dwTime);
  DWORD SendGetCurrentPositionCommand();
  DWORD SendSetMciSetFormatCommand(DWORD dwTimeFormat);
  DWORD SendEjectCdCommand();
};

}

#endif
