export const fetchDataPUT = async (url: string, body: Record<string, unknown>) => {

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        const data = await res.json();

        return data;

    } catch (error) {

        console.error('Błąd podczas pobierania danych:', error);
        return { status: 500, message: 'Błąd podczas pobierania danych' };

    }

};