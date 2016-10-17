#pragma once

#pragma comment(lib, "ws2_32.lib")
#include <winsock2.h>
#include <windows.h>
//#include <synchapi.h>

#define FORMAT_MESSAGE_ALLOCATE_BUFFER 0x00000100

HANDLE WINAPI CreateMutex(_In_opt_ LPSECURITY_ATTRIBUTES lpMutexAttributes, _In_ BOOL bInitialOwner, _In_opt_ LPCTSTR lpName);
HANDLE WINAPI CreateEvent(_In_opt_ LPSECURITY_ATTRIBUTES lpEventAttributes, _In_ BOOL bManualReset, _In_ BOOL bInitialState, _In_opt_ LPCTSTR lpName);
DWORD WINAPI WaitForSingleObject(_In_ HANDLE hHandle, _In_ DWORD dwMilliseconds);
HANDLE WINAPI OpenThread(_In_ DWORD dwDesiredAccess, _In_ BOOL bInheritHandle, _In_ DWORD dwThreadId);
DWORD_PTR WINAPI SetThreadAffinityMask(_In_ HANDLE hThread, _In_ DWORD_PTR dwThreadAffinityMask);
DWORD WINAPI GetTickCount(void);
HLOCAL WINAPI LocalFree(_In_ HLOCAL hMem);