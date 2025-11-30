package zotte.dingen.cqrs.conversation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;


public class Conversation {

    @Id
    private String id;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdOn;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate conversationDate;

    private List<Line> lines;

    @JsonCreator
    public Conversation(@JsonProperty("id") String id,
                        @JsonProperty("lines") List<Line> lines,
                        @JsonProperty("createdOn") LocalDateTime createdOn,
                        @JsonProperty("conversationDate") LocalDate conversationDate
                        ) {
        this.id = id;
        this.createdOn = createdOn == null ? LocalDateTime.now() : createdOn;
        this.conversationDate = conversationDate;
        this.lines = lines;
    }

    public String getId() {
        return id;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public LocalDate getConversationDate() {
        return conversationDate;
    }

    public List<Line> getLines() {
        return lines;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Conversation that = (Conversation) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(lines, that.lines) &&
                Objects.equals(conversationDate, that.conversationDate) &&
                Objects.equals(createdOn, that.createdOn)
                ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, lines, conversationDate, createdOn);
    }

    @Override
    public String toString() {
        return "Conversation{" +
                "id='" + id + '\'' +
                ", createdOn=" + createdOn +
                ", conversationDate=" + conversationDate +
                ", lines=" + lines +
                ", Test" +
                '}';
    }
}
