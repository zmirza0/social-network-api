const { Thoughts, Users } = require("../models");

module.exports = {
  getAllThoughts(req, res) {
    Thoughts.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getThoughtsById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        res.sendStatus(400);
      });
  },

  createThoughts({ body }, res) {
    Thoughts.create(body)
      .then(({ _id }) => {
        return Users.FindOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

  updateThoughts({ params, body }, res) {
    Thoughts.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "reactions", select: "-__v" })
      .select("-___v")
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

  deleteThoughts({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought with that ID!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },
};