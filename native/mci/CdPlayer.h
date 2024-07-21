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
private:
  MCI_STATUS_PARMS mciStatusParms;
  MCI_GENERIC_PARMS mciGenericParms;
  MCI_OPEN_PARMS mciOpenParms;
  MCI_PLAY_PARMS mciPlayParms;
  DWORD _OpenCd();
  DWORD _GetTrackCount();
  DWORD _CloseCd();
};

} // mci

#endif //CDPLAYER_H
