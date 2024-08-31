#include <windows.h>
#include <vector>
#include "CdPlayerUtil.h"

namespace mci {
  std::vector<std::string> CdPlayerUtil::GetDriveLetters() {
    std::vector<std::string> driveLetters;
    for (int i = 0; i < 26; ++i) {
      TCHAR szDrive[] = { (TCHAR)('A' + i), L':', L'\\', L'\0' };
      if (!GetVolumeInformation(szDrive, NULL, NULL, NULL, NULL, NULL, NULL, 0)) continue;
      if (GetDriveType(szDrive) != DRIVE_CDROM) continue;
      driveLetters.push_back(std::string(1, 'A' + i) + ":");
    }
    return driveLetters;
  }
} // mci