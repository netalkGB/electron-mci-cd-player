#ifndef CDPLAYEREXCEPTION_H
#define CDPLAYEREXCEPTION_H

#include <exception>
#include <string>
#include <utility>

namespace mci {
  class CdPlayerException : public std::exception {
  public:
    explicit CdPlayerException(std::string message) : message_(std::move(message)) {}

    [[nodiscard]] const char* what() const noexcept override {
      return message_.c_str();
    }

  private:
    std::string message_;
  };
}

#endif