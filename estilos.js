import { StyleSheet, View, Text, Image } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 0,
    paddingTop: 0
  },
  card: {
    backgroundColor: "lightgray",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    flexDirection: "row",  
    justifyContent: "space-between",
    alignItems: "center"
  },
  textoContainer: {
    flex: 1,
    paddingRight: 10
  },
  libroTitulo: {
    fontSize: 18,
    color: "#4b4a4a"
  },
  libroNombre: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5
  },
  autor: {
    fontSize: 16,
    color: "#6c4444",
    marginTop: 5
  },
  texto: {
    fontSize: 14,
    marginTop: 5,
    color: "#000000"
  },
  imagen: {
    width: 80,
    height: 120,
    borderRadius: 5
  },
  botones: {
    gap: 10,
    marginHorizontal: 20
  }
});