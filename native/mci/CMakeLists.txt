#cmake_minimum_required(VERSION 3.10)
cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED YES)
set(CMAKE_CXX_EXTENSIONS NO)

project(mci)

execute_process(
        COMMAND node --version
        OUTPUT_VARIABLE NODE_VERSION_RAW
        OUTPUT_STRIP_TRAILING_WHITESPACE
)
string(REGEX REPLACE "^v" "" NODE_VERSION "${NODE_VERSION_RAW}")

execute_process(
        COMMAND cmd /c echo %USERNAME%
        OUTPUT_VARIABLE USERNAME_RAW
        OUTPUT_STRIP_TRAILING_WHITESPACE
)

set(NODE_INCLUDE_DIR "C:/Users/${USERNAME_RAW}/AppData/Local/node-gyp/Cache/${NODE_VERSION}/include/node")
set(NAPI_INCLUDE_DIR "./node_modules/node-addon-api/")

file(GLOB SOURCE_FILES "*.cpp" "*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC} ${NODE_INCLUDE_DIR} ${NAPI_INCLUDE_DIR})

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
