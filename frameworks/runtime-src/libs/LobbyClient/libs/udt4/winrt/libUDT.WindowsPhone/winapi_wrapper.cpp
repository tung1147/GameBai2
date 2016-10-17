#include "winapi_wrapper.h"


HANDLE WINAPI CreateMutex(_In_opt_ LPSECURITY_ATTRIBUTES lpMutexAttributes, _In_ BOOL bInitialOwner, _In_opt_ LPCTSTR lpName){
	return 0;
}

HANDLE WINAPI CreateEvent(_In_opt_ LPSECURITY_ATTRIBUTES lpEventAttributes, _In_ BOOL bManualReset, _In_ BOOL bInitialState, _In_opt_ LPCTSTR lpName){
	return 0;
}

DWORD WINAPI WaitForSingleObject(_In_ HANDLE hHandle, _In_ DWORD dwMilliseconds){
	return 0;
}

HANDLE WINAPI OpenThread(_In_ DWORD dwDesiredAccess, _In_ BOOL bInheritHandle, _In_ DWORD dwThreadId){
	return 0;
}

DWORD_PTR WINAPI SetThreadAffinityMask(_In_ HANDLE hThread, _In_ DWORD_PTR dwThreadAffinityMask){
	return 0;
}

DWORD WINAPI GetTickCount(void){

	return 0;
}

HLOCAL WINAPI LocalFree(_In_ HLOCAL hMem){
	return 0;
}
