package zotte.dingen.cqrs.conversation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public class Participant {

    private String name;
    private boolean victim;

    @JsonCreator
    public Participant(@JsonProperty("name") String name, @JsonProperty("victim") boolean victim) {
        this.name = name;
        this.victim = victim;
    }

    public String getName() {
        return name;
    }

    public boolean isVictim() {
        return victim;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Participant that = (Participant) o;
        return victim == that.victim &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, victim);
    }

    @Override
    public String toString() {
        return "Participant{" +
                "name='" + name + '\'' +
                ", victim=" + victim +
                '}';
    }
}
