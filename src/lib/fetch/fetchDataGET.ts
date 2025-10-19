export const fetchDataGET = async (url: string, notSameOrigin=false) => {

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
            },
            credentials: notSameOrigin ? 'include' : 'same-origin' 
        });        

        const data = await response.json();
        return data;

    } catch (error) {

        console.error('Błąd podczas pobierania danych:', error);
        return { status: 500, message: 'Błąd podczas pobierania danych' };
        
    }

};