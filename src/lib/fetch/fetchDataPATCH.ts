export const fetchDataPATCH = async (url: string, body: Record<string, unknown>) => {

    try {

        const res = await fetch(url, {
            method: 'PATCH',
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