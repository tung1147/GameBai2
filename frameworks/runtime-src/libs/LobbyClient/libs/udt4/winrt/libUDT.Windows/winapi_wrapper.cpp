#include "winapi_wrapper.h"
#include <synchapi.h>
#include <WinBase.h>
#include <Processthreadsapi.h>
#include <cstdlib>

HANDLE WINAPI CreateMutex(_In_opt_ LPSECURITY_ATTRIBUTES lpMutexAttributes, _In_ BOOL bInitialOwner, _In_opt_ LPCTSTR lpName){
	_In_ DWORD flag = bInitialOwner ? CREATE_MUTEX_INITIAL_OWNER : 0x00000000;
	return CreateMutexEx(lpMutexAttributes, lpName, flag, 0);
}

HANDLE WINAPI CreateEvent(_In_opt_ LPSECURITY_ATTRIBUTES lpEventAttributes, _In_ BOOL bManualReset, _In_ BOOL bInitialState, _In_opt_ LPCTSTR lpName){
	_In_ DWORD dwFlags = bInitialState ? CREATE_EVENT_INITIAL_SET : CREATE_EVENT_MANUAL_RESET;
	return CreateEventEx(lpEventAttributes, lpName, dwFlags, 0);
}

DWORD WINAPI WaitForSingleObject(_In_ HANDLE hHandle, _In_ DWORD dwMilliseconds){
	return WaitForSingleObjectEx(hHandle, dwMilliseconds, false);
}

HANDLE WINAPI OpenThread(_In_ DWORD dwDesiredAccess, _In_ BOOL bInheritHandle, _In_ DWORD dwThreadId){

	return 0;
}

DWORD_PTR WINAPI SetThreadAffinityMask(_In_ HANDLE hThread, _In_ DWORD_PTR dwThreadAffinityMask){
	return 0;
}

DWORD WINAPI GetTickCount(void){
	static LARGE_INTEGER s_frequency;
	static BOOL s_use_qpc = QueryPerformanceFrequency(&s_frequency);
	if (s_use_qpc) {
		LARGE_INTEGER now;
		QueryPerformanceCounter(&now);
		return (1000ULL * now.QuadPart) / s_frequency.QuadPart;
	}
	return 0;
}

HLOCAL WINAPI LocalFree(_In_ HLOCAL hMem){
	free(hMem);
	return 0;
}
