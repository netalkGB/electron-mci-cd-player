#ifndef CDPLAYER_H
#define CDPLAYER_H

#include <windows.h>

namespace mci {

class CdPlayer {
public:
  CdPlayer();
  ~CdPlayer();
  bool OpenCd();
  int GetTrackCount();
  bool CloseCd();
  void Play(int track);
  void Stop();
  void Pause();
  void Resume();
  int GetCurrentTrackNumber();
  unsigned long GetTrackLength(int track);
  unsigned long GetCurrentPosition();
private:
  MCI_STATUS_PARMS mciStatusParms;
  MCI_GENERIC_PARMS mciGenericParms;
  MCI_OPEN_PARMS mciOpenParms;
  MCI_PLAY_PARMS mciPlayParms;
  MCI_SET_PARMS mciSetParms;
  DWORD _OpenCd();
  DWORD _GetTrackCount();
  DWORD _CloseCd();
  DWORD _GetTrackStart(DWORD dwTrack);
  DWORD GetTrackStart(DWORD dwTrack);
  DWORD _Play(DWORD dwTrackStart);
  DWORD _Stop();
  DWORD _Pause();
  DWORD _Resume();
  DWORD _GetCurrentTrackNumber();
  DWORD _GetTrackLength(DWORD dwTrack);
  DWORD ConvertToMilliseconds(DWORD dwTime);
  DWORD _GetCurrentPosition();
  DWORD _SetMciSetFormat(DWORD dwTimeFormat);
};

} // mci

#endif //CDPLAYER_H
