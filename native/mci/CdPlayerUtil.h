#ifndef CDPLAYERUTIL_H
#define CDPLAYERUTIL_H
#include <string>
#include <vector>

namespace mci {

class CdPlayerUtil {
public:
  static std::vector<char> GetDriveLetters();
};

}

#endif

