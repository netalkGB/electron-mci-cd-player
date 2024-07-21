// CdPlayerException.h
#ifndef CDPLAYEREXCEPTION_H
#define CDPLAYEREXCEPTION_H

#include <exception>
#include <string>

class CdPlayerException : public std::exception {
public:
  CdPlayerException(const std::string& message) : message_(message) {}

  virtual const char* what() const noexcept override {
    return message_.c_str();
  }

private:
  std::string message_;
};

#endif // CDPLAYEREXCEPTION_H