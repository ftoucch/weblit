const filterScholarresponse = (data) => {
    const filteredPapers = data.data.filter(paper => paper.abstract !== null && paper.abstract.trim() !== '');
    return filteredPapers;
}

export default filterScholarresponse