import { getCookie, setCookie } from "./cookies";

export const getRoleFromCookie = (): string | null => {
    const token = getCookie("token");
    if (token) {
        const role = JSON.parse(token).role;
        setCookie("role", role,1); 
        return role;
    }
    return null;
};

export const getUserFromCookie = (): number => {
    const token = getCookie("token");
    if (token) {
        const user: number = JSON.parse(token).id;
        return user;
    }
    return 0;
};

export const getDepartmentFromCookie = (): string | null=> {
    const token = getCookie("token");
    if (token) {
        const department: string = JSON.parse(token).department;
        return department;
    }
    return null;
};

export const getEmailFromCookie = (): string | null=> {
    const token = getCookie("token");
    if (token) {
        const department: string = JSON.parse(token).username;
        return department;
    }
    return null;
};




export const role = getRoleFromCookie();
export const userid = getUserFromCookie();
export const userdepartment = getDepartmentFromCookie();
export const useremail = getEmailFromCookie();



export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
};

export const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);
    return `data:image/jpeg;base64,${base64String}`;
};

export const formatDate = (dateString: Date | null) => {
    const date = new Date(dateString!);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
