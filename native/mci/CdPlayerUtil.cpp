#include <windows.h>
#include <vector>
#include "CdPlayerUtil.h"

namespace mci {
  std::vector<char> CdPlayerUtil::GetDriveLetters() {
    std::vector<char> driveLetters;
    for (int i = 0; i < 26; ++i) {
      TCHAR szDrive[] = { (TCHAR)('A' + i), L':', L'\\', L'\0' };
      if (!GetVolumeInformation(szDrive, NULL, NULL, NULL, NULL, NULL, NULL, 0)) continue;
      if (GetDriveType(szDrive) != DRIVE_CDROM) continue;
      driveLetters.push_back((char) ('A' + i));
    }
    return driveLetters;
  }
} // mci