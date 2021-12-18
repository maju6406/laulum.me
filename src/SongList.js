import React, { useMemo, useState } from "react";
import { extract, partial_ratio } from "fuzzball";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

import slugify from "./slugify";

const SongList = (props) => {
  const { songs } = props;
  const history = useHistory()

  const [searchTerm, setSearchTerm] = useState("");

  const searchIsEmpty = searchTerm.trim().length === 0

  const sortedSongs = useMemo(() => {
    const fuzzSortedSongs = extract(searchTerm, songs, { scorer: partial_ratio, processor: choice => choice.name, limit: searchIsEmpty ? undefined : 15 })
    return fuzzSortedSongs
  }, [songs, searchTerm, searchIsEmpty])

  const handleSubmit = () => {
    if (sortedSongs.length === 0) {
      return
    }
    history.push("songs/" + slugify(sortedSongs[0][0].name))
  }

  return (
    <div>
      <Helmet>
        <title>The Majumdar Songbook</title>
      </Helmet>
      <div className="searchbar">
        <div className="input-group">
          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              placeholder="Type song name and press enter/submit"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="song-list">
        {sortedSongs.map(([s, score]) => (
          <Link to={"songs/" + slugify(s.name)} key={s.id}>
            <div className="song-card" style={!searchIsEmpty ? {opacity: score / 100 } : {}}>{s.name}</div>
          </Link>
        ))}
      </div>
      <div className="footer">
        <div className="footer-content">
          Thank you Tim Nelson!!
        </div>
      </div>
    </div>
  );
};

export default SongList;
