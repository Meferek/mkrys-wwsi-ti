export const fetchDataPOST = async (url: string, body: Record<string, unknown>) => {

    try {

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        
        const data = await res.json();
        
        // Jeśli response nie zawiera status, dodaj go z HTTP status code
        if (!data.status) {
            data.status = res.status;
        }

        return data;

    } catch (error) {

        console.error('Błąd podczas pobierania danych:', error);
        return { status: 500, error: 'Błąd podczas pobierania danych' };

    }

};